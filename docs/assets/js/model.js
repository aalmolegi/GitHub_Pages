import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";

export async function loadMetadata() {
  const res = await fetch("../assets/model/metadata.json");
  if (!res.ok) throw new Error("Failed to load metadata.json");
  return await res.json();
}

export async function loadModel() {
  // Model file is stored in the repo and served by GitHub Pages
  const session = await ort.InferenceSession.create("../assets/model/model.onnx", {
    executionProviders: ["wasm"],
  });
  return session;
}
