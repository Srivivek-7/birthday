#!/usr/bin/env python3
"""
Birthday website launcher.
Runs the same React app via Vite. Use this as the main entry point.

Usage:
  python main.py          # Start dev server (localhost)
  python main.py --mobile # Start with --host for phone access on same WiFi
"""

import os
import subprocess
import sys

def main():
    # Run from the directory where main.py lives
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    npm_cmd = "npm"
    run_cmd = ["run", "dev:mobile"] if "--mobile" in sys.argv else ["run", "dev"]

    print("Starting birthday website...")
    print("(Same app as before — just launched from Python.)")
    print()
    try:
        subprocess.run([npm_cmd] + run_cmd, check=True)
    except FileNotFoundError:
        print("Error: npm not found. Install Node.js from https://nodejs.org")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
