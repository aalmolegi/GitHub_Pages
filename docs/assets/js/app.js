import { ort, loadMetadata, loadModel } from "./model.js";

let session = null;
let metadata = null;

function setStatus(msg) {
  const el = document.getElementById("modelStatus");
  if (el) el.textContent = msg;
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

function toFloat32(values) {
  return new Float32Array(values.map(v => Number(v)));
}

async function predict(formValues) {
  const inputName = metadata.input_name;
  const outputName = metadata.output_name;

  const data = toFloat32(formValues);
  const tensor = new ort.Tensor("float32", data, [1, data.length]);

  const feeds = { [inputName]: tensor };
  const results = await session.run(feeds);

  const out = results[outputName].data;
  return Array.from(out);
}

async function init() {
  try {
    setStatus("Loading metadata…");
    metadata = await loadMetadata();
    document.getElementById("metadataOutput").textContent = pretty(metadata);

    setStatus("Loading model…");
    session = await loadModel();

    setStatus("Model loaded ✓ Ready to predict");
  } catch (e) {
    console.error("Init failed:", e);
    setStatus("Error: " + (e?.message ?? String(e)));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();

  const form = document.getElementById("predictForm");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    if (!session || !metadata) {
      console.warn("Predict clicked but model not loaded yet.");
      return;
    }

    const fd = new FormData(form);
    const values = ["f1", "f2", "f3", "f4"].map(k => fd.get(k));

    const outEl = document.getElementById("predictionOutput");
    outEl.textContent = "Running…";

    try {
      const pred = await predict(values);
      outEl.textContent = pretty({ prediction: pred });
    } catch (e) {
      console.error("Predict failed:", e);
      outEl.textContent = "Error: " + (e?.message ?? String(e));
    }
  });
});
