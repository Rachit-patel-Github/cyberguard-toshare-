const storagePrefix = "cyberguard_local_";

const getStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readRecords = (entity) => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    return JSON.parse(storage.getItem(`${storagePrefix}${entity}`) || "[]");
  } catch {
    return [];
  }
};

const writeRecords = (entity, records) => {
  getStorage()?.setItem(`${storagePrefix}${entity}`, JSON.stringify(records));
};

const entityStore = (entity) => ({
  async list(sort, limit) {
    const records = readRecords(entity);
    if (sort === "-created_date") records.sort((a, b) => new Date(String(b.created_date)).getTime() - new Date(String(a.created_date)).getTime());
    return typeof limit === "number" ? records.slice(0, limit) : records;
  },
  async filter() {
    return readRecords(entity);
  },
  async get(id) {
    return readRecords(entity).find((record) => record.id === id) || null;
  },
  async create(data) {
    const record = { id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, created_date: new Date().toISOString(), ...data };
    writeRecords(entity, [record, ...readRecords(entity)]);
    return record;
  },
  async update(id, changes) {
    const records = readRecords(entity).map((record) => record.id === id ? { ...record, ...changes } : record);
    writeRecords(entity, records);
    return records.find((record) => record.id === id) || null;
  },
  async delete(id) {
    writeRecords(entity, readRecords(entity).filter((record) => record.id !== id));
  },
});

export const localDb = {
  entities: new Proxy({}, { get: (_, entity) => entityStore(String(entity)) }),
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => ({ file_url: file ? URL.createObjectURL(file) : "" }),
    },
  },
};

const riskTerms = ["urgent", "immediately", "verify", "suspended", "refund", "prize", "gift card", "crypto", "investment", "otp", "password", "click", "payment", "upi", "bank", "whatsapp"];
const protectedBrands = ["netflix", "paypal", "google", "microsoft", "apple", "amazon", "instagram", "whatsapp", "facebook"];

import { getLocalModelPrediction } from "@/lib/localModelService";

const levelFor = (risk) => risk >= 81 ? "dangerous" : risk >= 61 ? "high_risk" : risk >= 36 ? "medium_risk" : risk >= 16 ? "low_risk" : "safe";

const normalizeDomainLabel = (value) => value.toLowerCase().replace(/[01345$@]/g, (character) => ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "$": "s", "@": "a" })[character] || character).replace(/[^a-z]/g, "");

const editDistance = (first, second) => {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let row = 1; row <= first.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= second.length; column += 1) {
      const above = previous[column];
      previous[column] = Math.min(previous[column] + 1, previous[column - 1] + 1, diagonal + (first[row - 1] === second[column - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[second.length];
};

export const runLocalScan = async (scanType, value) => {
  const input = value.trim();
  const lower = input.toLowerCase();
  const signals = [];
  let score = 8;

  if (scanType === "website") {
    try {
      const url = new URL(input.includes("://") ? input : `https://${input}`);
      if (url.protocol === "http:") { score += 18; signals.push("The link uses unencrypted HTTP."); }
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) { score += 28; signals.push("The link uses a raw IP address instead of a domain."); }
      if (url.hostname.includes("xn--")) { score += 25; signals.push("The domain uses punycode, which can be used for lookalike domains."); }
      if (url.username || url.hostname.split(".").length > 4 || url.href.length > 140) { score += 14; signals.push("The URL has an unusual structure."); }
      if (/(login|verify|secure|account|wallet|bank|payment)/.test(lower)) { score += 14; signals.push("The address contains terms often used in credential or payment lures."); }
      const rawLabels = url.hostname.replace(/^www\./, "").split(".").filter(Boolean);
      const labels = rawLabels.map(normalizeDomainLabel).filter(Boolean);
      const substitutedBrand = rawLabels.find((label) => protectedBrands.some((brand) => label !== brand && normalizeDomainLabel(label) === brand));
      const lookalike = substitutedBrand || labels.find((label) => protectedBrands.find((brand) => label !== brand && editDistance(label, brand) <= 1));
      if (lookalike) {
        const brand = protectedBrands.find((candidate) => (
          substitutedBrand
            ? normalizeDomainLabel(substitutedBrand) === candidate
            : lookalike !== candidate && editDistance(lookalike, candidate) <= 1
        ));
        score += 54;
        signals.push(`The domain label “${lookalike}” closely imitates the ${brand} brand name.`);
      }
    } catch {
      score = 55;
      signals.push("This does not look like a valid web address.");
    }
  } else if (scanType === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) { score += 45; signals.push("The email address format is invalid."); }
    if (/(support|security|verify|billing|wallet|bank)/.test(lower)) { score += 16; signals.push("The address uses an impersonation-prone mailbox name."); }
  } else if (scanType === "phone") {
    if (!/^\+?[0-9()\-\s]{7,20}$/.test(input)) { score += 42; signals.push("The phone number format is invalid."); }
    // A valid format only proves that this looks like a phone number, not that it is trustworthy.
    score = Math.max(score, 25);
    signals.push("This number is unverified. Offline mode cannot check carrier reputation or spam-report databases.");
  } else if (scanType === "qr_code" || scanType === "screenshot") {
    score = 35;
    signals.push("Offline mode cannot inspect image contents. Treat unexpected QR codes and screenshots cautiously.");
  }

  const matches = riskTerms.filter((term) => lower.includes(term));
  if (matches.length) {
    score += Math.min(48, matches.length * 10);
    signals.push(`Suspicious pressure or financial terms found: ${matches.join(", ")}.`);
  }
  const modelPrediction = await getLocalModelPrediction(scanType, input);
  if (modelPrediction) {
    const modelScore = Math.round(modelPrediction.probability * 85);
    // Keep the rules as a guardrail, but surface a confident model signal.
    score = Math.max(score, modelScore);
    if (modelPrediction.probability >= 0.1) {
      signals.push(`Local ${modelPrediction.model} model estimates a ${Math.round(modelPrediction.probability * 100)}% likelihood of suspicious content.`);
    }
  }
  score = Math.min(100, score);
  const trustLevel = levelFor(score);
  const risky = score >= 36;
  return {
    risk_score: score,
    trust_level: trustLevel,
    threat_type: risky ? "Potential scam indicators" : scanType === "phone" ? "Unverified phone number" : "No obvious offline indicators",
    ai_explanation: signals.length ? signals.join(" ") : "No high-risk indicators were found by the offline rule-based check. This is not a reputation or malware guarantee.",
    recommended_action: risky ? "Do not enter credentials, payment details, or one-time codes. Verify the sender or service using an official website or phone number." : "Continue carefully. Independently verify the destination before sharing personal information or making a payment.",
    details: JSON.stringify({ mode: "offline", signals, model: modelPrediction, disclaimer: "This is a local model and heuristic check, not a live reputation or malware verdict." }),
  };
};

export const answerLocally = (question) => {
  const lower = question.toLowerCase();
  const warnings = riskTerms.filter((term) => lower.includes(term));
  const opening = warnings.length ? `I see possible risk cues: ${warnings.join(", ")}.` : "I can help you assess this safely.";
  return `${opening}\n\n**Safe next steps**\n\n- Do not share passwords, OTPs, recovery codes, or payment details.\n- Verify the sender through an official app, website, or phone number you find independently.\n- Avoid links in unexpected messages; type the known address yourself.\n- If money or an account may be involved, pause and contact the institution directly.\n\nFor a more specific check, paste the exact URL, sender address, or message text (remove private details first).`;
};
