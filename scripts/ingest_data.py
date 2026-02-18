#!/usr/bin/env python3
"""Data ingestion script — loads dataset into Elasticsearch.

Usage:
    uv run python scripts/ingest_data.py --index <name> --file <path>
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, ".")

from src.data_loader import bulk_index, create_index_if_not_exists, load_json, load_jsonl
from src.elastic_client import get_es_client
from src.utils import console, fatal, setup_logging

setup_logging()


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest data into Elasticsearch")
    parser.add_argument("--index", required=True, help="Target index name")
    parser.add_argument("--file", required=True, help="Path to JSON or JSONL file")
    parser.add_argument("--id-field", default=None, help="Field to use as document _id")
    parser.add_argument("--mappings-file", default=None, help="Path to mappings JSON file")
    args = parser.parse_args()

    path = Path(args.file)
    if not path.exists():
        fatal(f"File not found: {path}")

    es = get_es_client()

    # Create index with optional mappings
    mappings = None
    if args.mappings_file:
        import json

        with open(args.mappings_file) as f:
            mappings = json.load(f)

    created = create_index_if_not_exists(es, args.index, mappings=mappings)
    if created:
        console.print(f"[green]Created index: {args.index}[/]")
    else:
        console.print(f"[yellow]Index already exists: {args.index}[/]")

    # Load and index documents
    if path.suffix == ".jsonl":
        docs = load_jsonl(path)
    else:
        docs = load_json(path)

    console.print(f"[cyan]Indexing documents from {path}...[/]")
    result = bulk_index(args.index, docs, id_field=args.id_field)
    console.print(f"[bold green]Done![/] Indexed: {result['indexed']}, Errors: {result['errors']}")


if __name__ == "__main__":
    main()
