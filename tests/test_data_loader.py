"""Tests for data loading utilities — tested inline (no Elasticsearch connection needed)."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path


def _load_jsonl(path: Path):
    """Yield each non-empty line of a JSONL file as a parsed dict."""
    with path.open() as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def _load_json(path: Path) -> list:
    """Load a JSON array from a file."""
    with path.open() as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    raise ValueError(f"Expected JSON array, got {type(data).__name__}")


def test_load_jsonl():
    """Should yield each line as a dict."""
    data = [{"id": 1, "text": "hello"}, {"id": 2, "text": "world"}]
    with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
        for doc in data:
            f.write(json.dumps(doc) + "\n")
        path = Path(f.name)

    results = list(_load_jsonl(path))
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

    results = _load_json(path)
    assert len(results) == 2
    path.unlink()


def test_load_jsonl_skips_empty_lines():
    """Should skip blank lines in JSONL."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
        f.write('{"x": 1}\n')
        f.write("\n")
        f.write('{"x": 2}\n')
        path = Path(f.name)

    results = list(_load_jsonl(path))
    assert len(results) == 2
    path.unlink()


def test_load_json_raises_on_non_array():
    """Should raise ValueError if JSON root is not an array."""
    import pytest

    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump({"key": "value"}, f)
        path = Path(f.name)

    with pytest.raises(ValueError, match="Expected JSON array"):
        _load_json(path)
    path.unlink()
