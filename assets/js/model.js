import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.mjs";

// GitHub Pages is usually NOT cross-origin isolated -> threads can hang.
// Force single-thread WASM for reliability.
ort.env.wasm.numThreads = 1;

// Tell ORT where to fetch its .wasm binaries (CDN folder)
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

export { ort };

export async function loadMetadata() {
  const res = await fetch("../assets/model/metadata.json");
  if (!res.ok) throw new Error("Failed to load metadata.json");
  return await res.json();
}

export async function loadModel() {
  // this should resolve if model.onnx and wasm files are reachable
  const session = await ort.InferenceSession.create("../assets/model/model.onnx", {
    executionProviders: ["wasm"],
  });
  return session;
}
