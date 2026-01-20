# ML Model Website (GitHub Pages)

A static website that runs an ML model in the browser using ONNX Runtime Web.

## Live website
After deploy: https://<your-username>.github.io/<repo-name>/

## Features
- Clean landing page
- Demo page: enter inputs, get prediction
- Model runs client-side (no server)
- GitHub Actions deploy

## How to use
1. Put your ONNX model in: docs/assets/model/model.onnx
2. Update metadata: docs/assets/model/metadata.json
3. Push to main → site deploys automatically.

## Local preview
Open `docs/index.html` directly or use a simple server:
python -m http.server 8000 --directory docs
