import os
from pathlib import Path

def create_structure():
    
    # Define the structure
    structure = {
        ".github/workflows": [
            "deploy.yml",
        ],
        "docs": [
            "index.html",
            "favicon.ico"
        ],
        "docs/assets/css": [
            "style.css"
            ],
        "docs/assets/js": [
            "app.js", "model.js"
            ],
        "docs/assets/img": [
            "hero.png"
            ],
        "docs/assets/model": [
            "model.onnx", 
            "metadata.json"
            ],
        "docs/pages": [
            "about.html", 
            "demo.html", 
            "docs.html"
            ],
        "model_training": [
            "train.py",
            "export_onnx.py",
            "requirements.txt",
        ],
        "model_training/notebooks": [
            "exploration.ipynb",
        ],
        "tools": [
            "make_dummy_model.py",
            "validate_onnx.py",
        ],
    }
    
    # Create directories and files
    for directory, files in structure.items():
        dir_path = Path(directory)  # Convert string to Path object
        dir_path.mkdir(parents=True, exist_ok=True)
        
        for file in files:
            filepath = dir_path / file
            filepath.touch()
            print(f"Created: {filepath}")
    
    # Create additional root files
    additional_files = [
        ".gitignore", 
        "LICENSE",
        "requirements.txt",
        "README.md"
    ]
    
    for file in additional_files:
        filepath = Path(file)  # These are in the current directory
        filepath.touch()
        print(f"Created: {filepath}")

if __name__ == "__main__":
    create_structure()