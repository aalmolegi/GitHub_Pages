import json
from pathlib import Path

import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

from skl2onnx import to_onnx
import onnx

N_FEATURES = 4
FEATURE_NAMES = ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]

OUT_DIR = Path(__file__).resolve().parents[1] / "docs" / "assets" / "model"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# synthetic regression data
rng = np.random.default_rng(7)
X = rng.normal(size=(2000, N_FEATURES)).astype(np.float32)
w = np.array([2.5, -1.2, 0.7, 3.1], dtype=np.float32)
y = (X @ w + 0.5 * rng.normal(size=(2000,)).astype(np.float32) + 10.0).astype(np.float32)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("regressor", LinearRegression())
])
pipe.fit(X, y)

# export ONNX
X_sample = np.zeros((1, N_FEATURES), dtype=np.float32)
onnx_model = to_onnx(pipe, X_sample, target_opset=17)

onnx_path = OUT_DIR / "model.onnx"
onnx_path.write_bytes(onnx_model.SerializeToString())

# read real input/output names from the ONNX graph
m = onnx.load(str(onnx_path))
input_name = m.graph.input[0].name
output_name = m.graph.output[0].name

metadata = {
    "name": "Demo Regression Model (Synthetic)",
    "task": "regression",
    "input_name": input_name,
    "output_name": output_name,
    "features": [{"name": n, "type": "float"} for n in FEATURE_NAMES],
    "notes": "Preprocessing (StandardScaler) is included inside the ONNX."
}

(OUT_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

print("Wrote:", onnx_path)
print("Wrote:", OUT_DIR / "metadata.json")
print("ONNX input_name:", input_name)
print("ONNX output_name:", output_name)
