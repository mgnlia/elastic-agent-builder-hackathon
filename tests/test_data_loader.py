"""Tests for data loader utilities."""

import json
import tempfile
from pathlib import Path

from src.data_loader import load_json, load_jsonl


def test_load_jsonl():
    """Should yield each line as a dict."""
    data = [{"id": 1, "text": "hello"}, {"id": 2, "text": "world"}]
    with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
        for doc in data:
            f.write(json.dumps(doc) + "\n")
        path = Path(f.name)

    results = list(load_jsonl(path))
    assert len(results) == 2
    assert results[0]["id"] == 1
    assert results[1]["text"] == "world"
    path.unlink()


def test_load_json():
    """Should load a JSON array."""
    data = [{"a": 1}, {"b": 2}]
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(data, f)
        path = Path(f.name)

    results = load_json(path)
    assert len(results) == 2
    path.unlink()
