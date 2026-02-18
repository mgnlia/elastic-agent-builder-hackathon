"""Data ingestion utilities for loading datasets into Elasticsearch."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Iterator

from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

from .elastic_client import get_es_client


def load_jsonl(path: Path) -> Iterator[dict[str, Any]]:
    """Yield documents from a JSONL file."""
    with path.open() as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def load_json(path: Path) -> list[dict[str, Any]]:
    """Load a JSON array file."""
    with path.open() as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    raise ValueError(f"Expected JSON array, got {type(data).__name__}")


def create_index_if_not_exists(
    es: Elasticsearch,
    index: str,
    mappings: dict[str, Any] | None = None,
    settings: dict[str, Any] | None = None,
) -> bool:
    """Create an index with optional mappings/settings. Returns True if created."""
    if es.indices.exists(index=index):
        return False
    body: dict[str, Any] = {}
    if mappings:
        body["mappings"] = mappings
    if settings:
        body["settings"] = settings
    es.indices.create(index=index, body=body)
    return True


def bulk_index(
    index: str,
    documents: Iterator[dict[str, Any]] | list[dict[str, Any]],
    id_field: str | None = None,
    chunk_size: int = 500,
) -> dict[str, Any]:
    """Bulk-index documents into Elasticsearch.

    Args:
        index: Target index name.
        documents: Iterable of document dicts.
        id_field: Optional field to use as _id.
        chunk_size: Batch size for bulk API.

    Returns:
        Summary with success/error counts.
    """
    es = get_es_client()

    def _actions():
        for doc in documents:
            action: dict[str, Any] = {
                "_index": index,
                "_source": doc,
            }
            if id_field and id_field in doc:
                action["_id"] = doc[id_field]
            yield action

    success, errors = bulk(es, _actions(), chunk_size=chunk_size, raise_on_error=False)
    return {"indexed": success, "errors": len(errors) if isinstance(errors, list) else errors}
