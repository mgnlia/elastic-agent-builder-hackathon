"""Tests for CLI module."""

from typer.testing import CliRunner

from incident_commander.cli import app

runner = CliRunner()


def test_agents_command():
    result = runner.invoke(app, ["agents"])
    assert result.exit_code == 0
    assert "Triage Agent" in result.stdout
    assert "Diagnosis Agent" in result.stdout


def test_tools_command():
    result = runner.invoke(app, ["tools"])
    assert result.exit_code == 0
    assert "esql_error_correlation" in result.stdout
    assert "workflow_restart_service" in result.stdout
