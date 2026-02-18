"""Elasticsearch client wrapper with convenience helpers."""

from __future__ import annotations

from elasticsearch import Elasticsearch

from .config import settings


def get_es_client() -> Elasticsearch:
    """Create an authenticated Elasticsearch client."""
    if settings.elastic_cloud_id and settings.elastic_api_key:
        return Elasticsearch(
            cloud_id=settings.elastic_cloud_id,
            api_key=settings.elastic_api_key,
        )
    raise ValueError(
        "ELASTIC_CLOUD_ID and ELASTIC_API_KEY must be set. "
        "See .env.example for details."
    )


def check_connection() -> dict:
    """Verify connectivity and return cluster info."""
    es = get_es_client()
    return es.info().body
