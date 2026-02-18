"""Tests for CLI module."""

from typer.testing import CliRunner

from incident_commander.cli import app

runner = CliRunner()


def test_info_command():
    result = runner.invoke(app, ["info"])
    assert result.exit_code == 0
    assert "Incident Commander" in result.stdout


def test_agents_command():
    result = runner.invoke(app, ["agents"])
    assert result.exit_code == 0
    assert "Triage Agent" in result.stdout
    assert "Diagnosis Agent" in result.stdout
    assert "Remediation Agent" in result.stdout
    assert "Communication Agent" in result.stdout


def test_tools_command():
    result = runner.invoke(app, ["tools"])
    assert result.exit_code == 0
    assert "incident_cmd.error_rate_spike" in result.stdout
    assert "incident_cmd.restart_service" in result.stdout


def test_check_command_missing_config():
    """check should fail gracefully when env vars are not set."""
    result = runner.invoke(app, ["check"])
    # In CI, env vars are not set so check should exit with code 1
    assert result.exit_code == 1
    assert "Missing config" in result.stdout
