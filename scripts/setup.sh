#!/usr/bin/env bash
# Quick setup: install deps and provision Agent Builder resources.
set -euo pipefail

echo "=== Elastic Agent Builder Hackathon — Setup ==="

# 1. Install Python deps via uv
if ! command -v uv &>/dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

echo "Syncing dependencies..."
uv sync

# 2. Check .env
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Copy .env.example → .env and fill in your credentials."
    echo "   cp .env.example .env"
    exit 1
fi

# 3. Provision tools + agent
echo ""
echo "Provisioning Agent Builder tools and agent..."
uv run python -m src.setup_agent

echo ""
echo "✅ Setup complete! Try:  uv run elastic-agent chat 'Hello, what can you do?'"
