#!/usr/bin/env python3
"""Utility entry point for triggering small VES "nerve" actions.

This script is intentionally lightweight so it can be called from remote
shortcuts (for example Apple Shortcuts over SSH).  A command string is
provided as the first argument and mapped to a known action.  Each
execution is appended to ``nerve_commands.jsonl`` so the wider system
retains a memory of the impulses that flowed through it.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Callable

# ---------------------------------------------------------------------------
# Configuration helpers
# ---------------------------------------------------------------------------

def resolve_ves_root() -> Path:
    """Return the filesystem root of the VES portal.

    The root can be overridden by the ``VES_ROOT`` environment variable which
    is useful when the script is executed via SSH from a different working
    directory.  When unset we fall back to the directory containing this
    script.
    """

    env_root = os.getenv("VES_ROOT")
    if env_root:
        return Path(env_root).expanduser().resolve()
    return Path(__file__).resolve().parent


def resolve_memory_path(root: Path) -> Path:
    """Return the path to the JSONL log file used for nerve memories."""

    log_path = os.getenv("VES_NERVE_LOG")
    if log_path:
        return Path(log_path).expanduser().resolve()
    return root / "nerve_commands.jsonl"


# ---------------------------------------------------------------------------
# Command implementations
# ---------------------------------------------------------------------------

def run_command(command: str, *args: str, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    """
    Run a subprocess command and capture its stdout/stderr as text.

    Command failures (nonzero exit codes) do not raise exceptions; this function always
    returns a CompletedProcess object regardless of the command's exit code. Callers should
    check the `returncode` attribute if they need to handle failures.
    """

    return subprocess.run(
        [command, *args],
        cwd=cwd,
        check=False,
        text=True,
        capture_output=True,
    )


def check_status(root: Path) -> dict[str, str]:
    """Generate a lightweight health snapshot for the repository."""

    git_status = run_command("git", "status", "--short", cwd=root)
    git_branch = run_command("git", "rev-parse", "--abbrev-ref", "HEAD", cwd=root)
    git_commit = run_command("git", "rev-parse", "--short", "HEAD", cwd=root)

    # Check for git command failures
    if git_status.returncode != 0:
        return {
            "message": "⚠️ VES STATUS CHECK FAILED",
            "error": "Git status command failed",
            "details": git_status.stderr.strip(),
        }

    clean = not git_status.stdout.strip()
    status_summary = "clean" if clean else "changes"

    return {
        "message": "✅ VES ALIVE",
        "branch": git_branch.stdout.strip() if git_branch.returncode == 0 else "unknown",
        "commit": git_commit.stdout.strip() if git_commit.returncode == 0 else "unknown",
        "git_status": status_summary,
        "git_status_raw": git_status.stdout.strip(),
    }


def list_known_commands(_: Path) -> dict[str, str]:
    """Return a mapping of available nerve commands."""

    return {
        "message": "Available commands",
        "commands": ", ".join(sorted(COMMANDS.keys())),
    }


# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------

def log_command(log_file: Path, command: str, result: dict[str, str]) -> None:
    """Append a JSONL entry describing the executed nerve impulse."""

    log_entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "command": command,
        "result": result,
    }

    try:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        with log_file.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"Warning: Failed to log nerve command to {log_file}: {e}", file=sys.stderr)


# ---------------------------------------------------------------------------
# Command dispatch
# ---------------------------------------------------------------------------

COMMANDS: dict[str, Callable[[Path], dict[str, str]]] = {
    "check status": check_status,
    "help": list_known_commands,
    "list": list_known_commands,
}


def execute(command: str, root: Path, log_file: Path) -> dict[str, str]:
    """Execute the requested nerve command and log the outcome."""

    key = command.strip().lower()
    if key not in COMMANDS:
        result = {
            "message": "Unknown command",
            "command": command,
        }
        log_command(log_file, command, result)
        return result

    result = COMMANDS[key](root)
    log_command(log_file, command, result)
    return result


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Trigger VES nerve commands")
    parser.add_argument("command", help="The nerve command to execute")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    root = resolve_ves_root()
    log_file = resolve_memory_path(root)

    result = execute(args.command, root, log_file)
    print(json.dumps(result, ensure_ascii=False))
    if result.get("message") == "Unknown command":
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
