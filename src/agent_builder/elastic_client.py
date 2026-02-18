"""Elasticsearch client factory."""

from __future__ import annotations

from elasticsearch import Elasticsearch

from agent_builder.config import settings


def get_es_client() -> Elasticsearch:
    """Create and return an Elasticsearch client from settings."""
    if settings.elastic_cloud_id:
        return Elasticsearch(
            cloud_id=settings.elastic_cloud_id,
            api_key=settings.elastic_api_key,
        )
    if settings.elastic_url:
        return Elasticsearch(
            hosts=[settings.elastic_url],
            api_key=settings.elastic_api_key,
        )
    raise ValueError(
        "Set ELASTIC_CLOUD_ID or ELASTIC_URL in your environment / .env file."
    )
