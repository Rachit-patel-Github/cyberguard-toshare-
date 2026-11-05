"""Train browser-friendly CyberGuard classifiers from public datasets.

Datasets downloaded by this script:
  * UCI SMS Spam Collection (CC BY 4.0)
  * Apache SpamAssassin public corpus (ham/spam)
  * PhishTank verified phishing feed (subject to PhishTank terms)
  * Tranco popular-domain list (research-oriented ranking; used as a benign proxy)

Run from the repository root:
    python scripts/train_local_models.py

The output files are intentionally not committed. Review metrics before deploying
them, and refresh the PhishTank/Tranco inputs regularly because URLs change fast.
"""

from __future__ import annotations

import csv
import email
import json
import re
import tarfile
import zipfile
from email import policy
from pathlib import Path
from urllib.request import Request, urlopen

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
MODELS = ROOT / "public" / "models"
USER_AGENT = "CyberGuard-Expo training (local research build)"


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        return
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=90) as response, destination.open("wb") as output:
        output.write(response.read())


def train_text_model(name: str, texts: list[str], labels: list[int]) -> dict:
    x_train, x_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english", max_features=2500, ngram_range=(1, 2), sublinear_tf=True)),
        ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])
    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_test)
    print(f"\n{name}\n{classification_report(y_test, predictions, target_names=['benign', 'suspicious'])}")

    vectorizer: TfidfVectorizer = pipeline.named_steps["tfidf"]
    classifier: LogisticRegression = pipeline.named_steps["classifier"]
    return {
        "kind": "tfidf-logistic-regression",
        "positive_label": "suspicious",
        "vocabulary": {token: int(index) for token, index in vectorizer.vocabulary_.items()},
        "idf": vectorizer.idf_.tolist(),
        "coefficients": classifier.coef_[0].tolist(),
        "intercept": float(classifier.intercept_[0]),
        "token_pattern": vectorizer.token_pattern,
        "ngram_range": list(vectorizer.ngram_range),
    }


def load_sms() -> tuple[list[str], list[int]]:
    archive = RAW / "sms-spam-collection.zip"
    download("https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip", archive)
    with zipfile.ZipFile(archive) as zipped:
        content = zipped.read("SMSSpamCollection").decode("utf-8", errors="replace")
    rows = [line.split("\t", 1) for line in content.splitlines() if "\t" in line]
    return [text for _, text in rows], [1 if label == "spam" else 0 for label, _ in rows]


def extract_mail_text(payload: bytes) -> str:
    message = email.message_from_bytes(payload, policy=policy.default)
    values = [message.get("subject", "")]
    for part in message.walk():
        if part.get_content_type() == "text/plain" and part.get_content_disposition() != "attachment":
            try:
                values.append(part.get_content())
            except (LookupError, UnicodeError):
                pass
    return "\n".join(str(value) for value in values)[:10000]


def load_email_corpus() -> tuple[list[str], list[int]]:
    sources = {
        "ham": "https://spamassassin.apache.org/old/publiccorpus/20030228_easy_ham.tar.bz2",
        "spam": "https://spamassassin.apache.org/old/publiccorpus/20030228_spam.tar.bz2",
    }
    texts, labels = [], []
    for label, url in sources.items():
        archive = RAW / Path(url).name
        download(url, archive)
        with tarfile.open(archive, "r:bz2") as tar:
            for member in tar.getmembers():
                if not member.isfile() or member.size == 0:
                    continue
                extracted = tar.extractfile(member)
                if extracted:
                    content = extract_mail_text(extracted.read())
                    if content.strip():
                        texts.append(content)
                        labels.append(1 if label == "spam" else 0)
    return texts, labels


def url_features(value: str) -> list[float]:
    lowered = value.lower()
    host = re.sub(r"^[a-z]+://", "", lowered).split("/", 1)[0].split("@")[-1].split(":")[0]
    return [
        len(value), value.count("."), value.count("-"), value.count("/"), value.count("?"), value.count("="),
        sum(character.isdigit() for character in value), float(lowered.startswith("http://")), float("@" in value),
        float("xn--" in host), float(len(host.split(".")) > 3), float(any(term in lowered for term in ("login", "verify", "secure", "account", "update", "wallet", "bank"))),
    ]


def load_url_corpus() -> tuple[list[str], np.ndarray]:
    phish_file = RAW / "phishtank-online-valid.csv"
    download("https://data.phishtank.com/data/online-valid.csv", phish_file)
    phishing = []
    with phish_file.open(encoding="utf-8", errors="replace", newline="") as stream:
        for row in csv.DictReader(stream):
            if row.get("url"):
                phishing.append(row["url"])

    list_id_file = RAW / "tranco-list-id.txt"
    download("https://tranco-list.eu/top-1m-id", list_id_file)
    list_id = list_id_file.read_text().strip()
    tranco_file = RAW / f"tranco-{list_id}-50000.csv"
    download(f"https://tranco-list.eu/download/{list_id}/50000", tranco_file)
    benign = [f"https://{line.rsplit(',', 1)[-1].strip()}" for line in tranco_file.read_text(encoding="utf-8", errors="replace").splitlines() if "," in line]

    size = min(len(phishing), len(benign), 50000)
    urls = phishing[:size] + benign[:size]
    labels = np.array([1] * size + [0] * size)
    return urls, labels


def train_url_model() -> dict:
    urls, labels = load_url_corpus()
    x_train, x_test, y_train, y_test = train_test_split(urls, labels, test_size=0.2, random_state=42, stratify=labels)
    # Character n-grams catch obfuscated brand names, unusual TLD/path patterns,
    # and punctuation tricks that a small numeric feature set misses.
    vectorizer = TfidfVectorizer(analyzer="char", lowercase=True, ngram_range=(3, 5), min_df=2, max_features=12000, sublinear_tf=True)
    x_train_vectors = vectorizer.fit_transform(x_train)
    x_test_vectors = vectorizer.transform(x_test)
    classifier = LogisticRegression(max_iter=1000, class_weight="balanced")
    classifier.fit(x_train_vectors, y_train)
    print(f"\nURL character model\n{classification_report(y_test, classifier.predict(x_test_vectors), target_names=['benign proxy', 'phishing'])}")
    return {
        "kind": "url-character-tfidf-logistic-regression",
        "positive_label": "phishing",
        "analyzer": "char",
        "ngram_range": list(vectorizer.ngram_range),
        "vocabulary": {token: int(index) for token, index in vectorizer.vocabulary_.items()},
        "idf": vectorizer.idf_.tolist(),
        "coefficients": classifier.coef_[0].tolist(),
        "intercept": float(classifier.intercept_[0]),
    }


def main() -> None:
    MODELS.mkdir(parents=True, exist_ok=True)
    sms_texts, sms_labels = load_sms()
    email_texts, email_labels = load_email_corpus()
    models = {
        "message": train_text_model("SMS/message model", sms_texts, sms_labels),
        "email": train_text_model("Email model", email_texts, email_labels),
        "website": train_url_model(),
    }
    for name, model in models.items():
        (MODELS / f"{name}-model.json").write_text(json.dumps(model, separators=(",", ":")), encoding="utf-8")
    manifest = {
        "generated_by": "scripts/train_local_models.py",
        "models": list(models),
        "limitations": [
            "URL model uses character patterns and popular domains as a benign proxy; it is not a reputation service.",
            "Phone, QR-image, and screenshot reputation require separately licensed labeled data or a live reputation provider.",
            "Do not use model output as the sole security decision.",
        ],
    }
    (MODELS / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
