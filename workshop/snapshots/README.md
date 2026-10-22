# snapshots/

Versions of files that change between workshop steps, used by `workshop/rebuild-history.sh` to recreate the `step-NN` tags from the current working tree:

- `step-01/` — CLAUDE.md v1 and read-only settings (steps 1–3)
- `step-04/` — CLAUDE.md v2 and team settings (steps 4–5)
- `step-05/` — package manifests, lockfile, configs, `.gitignore`, `.claude/settings.json` and CLAUDE.md as they were before the testing step (keep the hook block and gitignore entries in sync with `step-04/`)

The final step always uses the working tree as is. If you change a file that lives here, update the snapshot too, then run the script.
