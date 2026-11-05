const MODEL_PATH = "/models";

let modelsPromise;

const fetchModel = async (name) => {
  const response = await fetch(`${MODEL_PATH}/${name}-model.json`);
  if (!response.ok) throw new Error(`Could not load the ${name} model.`);
  return response.json();
};

export const loadLocalModels = () => {
  if (!modelsPromise) {
    modelsPromise = Promise.all([
      fetchModel("website"),
      fetchModel("message"),
      fetchModel("email"),
    ]).then(([website, message, email]) => ({ website, message, email })).catch((error) => {
      // The scanner remains useful when a deployment intentionally omits model files.
      console.warn("Local threat models are unavailable; using rules only.", error);
      return null;
    });
  }
  return modelsPromise;
};

const sigmoid = (value) => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, value))));

const probabilityFromFeatures = (model, features) => sigmoid(
  model.intercept + model.coefficients.reduce((sum, coefficient, index) => sum + coefficient * features[index], 0),
);

const urlFeatures = (value) => {
  const lowered = value.toLowerCase();
  const host = lowered.replace(/^[a-z]+:\/\//, "").split("/", 1)[0].split("@").at(-1).split(":")[0];
  return [
    value.length, value.split(".").length - 1, value.split("-").length - 1,
    value.split("/").length - 1, value.split("?").length - 1, value.split("=").length - 1,
    (value.match(/\d/g) || []).length, Number(lowered.startsWith("http://")), Number(value.includes("@")),
    Number(host.includes("xn--")), Number(host.split(".").length > 3),
    Number(/login|verify|secure|account|update|wallet|bank/.test(lowered)),
  ];
};

const textFeatures = (model, value) => {
  if (model.analyzer === "char") {
    const lowered = value.toLowerCase();
    const terms = [];
    for (let size = model.ngram_range[0]; size <= model.ngram_range[1]; size += 1) {
      for (let index = 0; index <= lowered.length - size; index += 1) terms.push(lowered.slice(index, index + size));
    }
    return tfidfFeatures(model, terms);
  }
  const tokens = value.toLowerCase().match(/[\p{L}\p{N}_]{2,}/gu) || [];
  const terms = [...tokens, ...tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`)];
  return tfidfFeatures(model, terms);
};

const tfidfFeatures = (model, terms) => {
  const counts = new Map();
  terms.forEach((term) => {
    const index = model.vocabulary[term];
    if (index !== undefined) counts.set(index, (counts.get(index) || 0) + 1);
  });
  const features = new Array(model.coefficients.length).fill(0);
  let squaredLength = 0;
  counts.forEach((count, index) => {
    const weight = (1 + Math.log(count)) * model.idf[index];
    features[index] = weight;
    squaredLength += weight ** 2;
  });
  const length = Math.sqrt(squaredLength) || 1;
  return features.map((weight) => weight / length);
};

export const getLocalModelPrediction = async (scanType, value) => {
  const models = await loadLocalModels();
  const name = scanType === "website" ? "website" : scanType === "email" ? "email" : scanType === "message" ? "message" : null;
  const model = name && models?.[name];
  if (!model) return null;
  const features = model.kind === "url-lexical-logistic-regression" ? urlFeatures(value) : textFeatures(model, value);
  return { model: name, probability: probabilityFromFeatures(model, features) };
};
