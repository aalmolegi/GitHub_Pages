import { loadMetadata, loadModel } from "./model.js";

let session = null;
let metadata = null;

function setStatus(msg) {
  document.getElementById("modelStatus").textContent = msg;
}

function toFloat32(values) {
  return new Float32Array(values.map(v => Number(v)));
}

async function predict(formValues) {
  // Default: 4 numeric features → shape [1, 4]
  // Update this to match your model's expected input.
  const inputName = metadata.input_name || "input";
  const tensor = new ort.Tensor("float32", toFloat32(formValues), [1, formValues.length]);

  const feeds = {};
  feeds[inputName] = tensor;

  const results = await session.run(feeds);

  // Default: take first output
  const outputName = metadata.output_name || Object.keys(results)[0];
  const out = results[outputName].data;

  return Array.from(out);
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

async function init() {
  try {
    setStatus("Loading metadata…");
    metadata = await loadMetadata();

    document.getElementById("metadataOutput").textContent = pretty(metadata);

    setStatus("Loading model… (first load can take a few seconds)");
    session = await loadModel();

    setStatus("Model loaded ✓ Ready to predict");
  } catch (e) {
    setStatus("Error: " + e.message);
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();

  const form = document.getElementById("predictForm");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!session || !metadata) return;

    const fd = new FormData(form);
    const values = ["f1","f2","f3","f4"].map(k => fd.get(k));

    const outEl = document.getElementById("predictionOutput");
    outEl.textContent = "Running…";

    try {
      const pred = await predict(values);
      outEl.textContent = pretty({ prediction: pred });
    } catch (e) {
      outEl.textContent = "Error: " + e.message;
      console.error(e);
    }
  });
});
