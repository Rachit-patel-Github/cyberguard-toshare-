# Local training data

`scripts/train_local_models.py` downloads source datasets into `data/raw/` and writes generated browser models to `public/models/`.

Do not commit raw datasets. The generated model artifacts are versioned so the deployed scanner can use them; retrain and review their metrics and source licenses before updating them. The URL model uses PhishTank verified phishing URLs and popular Tranco domains as a benign proxy; it is not a domain reputation service.
