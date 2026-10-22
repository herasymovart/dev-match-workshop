#!/usr/bin/env bash
# Switch between workshop steps.
#   ./workshop/go.sh 3          -> git switch --detach step-03 (read-only view of the state after prompt 3)
#   ./workshop/go.sh 1 live     -> branch live/step-01 from step-01: a sandbox to run Claude for real
#   ./workshop/go.sh keep       -> commit whatever a live demo produced on the current live branch
#   ./workshop/go.sh discard    -> throw away uncommitted changes (asks first)
#   ./workshop/go.sh list       -> list the steps
#   ./workshop/go.sh diff 2 3   -> what step 3 added relative to step 2
#   ./workshop/go.sh script 3   -> print the presenter script for step 3 (workshop/SCRIPT.uk.md)
set -euo pipefail
cd "$(dirname "$0")/.."

dirty() { [ -n "$(git status --porcelain)" ]; }

# Heading of the step's section in SCRIPT.uk.md (the file is identical on every tag).
script_heading() {
  case "$1" in
    0) echo "Вступ і дискусія" ;;
    4|5) echo "Кроки 4 і 5" ;;
    *) echo "Крок $1:" ;;
  esac
}
script_section() {
  local h; h="$(script_heading "$1")"
  awk -v h="$h" '/^## /{p = index($0, h) > 0} p' workshop/SCRIPT.uk.md
}

case "${1:-}" in
  list)
    git tag -l 'step-*' -n1 ;;
  diff)
    git diff --stat "step-$(printf '%02d' "$2")" "step-$(printf '%02d' "$3")" ;;
  script)
    [ -n "${2:-}" ] || { echo "usage: go.sh script <N>"; exit 1; }
    script_section "$2" ;;
  keep)
    dirty || { echo "nothing to keep"; exit 0; }
    git add -A && git commit -q -m "live demo on $(git branch --show-current)" && echo "committed on $(git branch --show-current)" ;;
  discard)
    dirty || { echo "nothing to discard"; exit 0; }
    git status --short
    read -r -p "Discard these changes? [y/N] " a; [ "$a" = "y" ] || exit 1
    git reset -q --hard && git clean -qfd && echo "discarded" ;;
  "")
    echo "usage: go.sh <N> [live] | keep | discard | list | diff <A> <B> | script <N>"; exit 1 ;;
  *)
    if dirty; then
      echo "Working tree has uncommitted changes (probably from a live demo on $(git branch --show-current)):"
      git status --short
      echo "Run ./workshop/go.sh keep (commit them on this branch) or ./workshop/go.sh discard, then switch again."
      exit 1
    fi
    n="$1"; tag="step-$(printf '%02d' "$n")"
    if [ "${2:-}" = "live" ]; then
      git switch -c "live/$tag" "$tag" 2>/dev/null || git switch "live/$tag"
      echo; echo "On branch live/$tag — run 'claude' here. Afterwards: ./workshop/go.sh keep (or discard), then ./workshop/go.sh <N>."
    else
      git switch --detach "$tag"
    fi
    echo; git log -1 --format='%C(yellow)%d%C(reset) %s'; echo; git ls-tree -r --name-only HEAD | grep -v '^workshop/' | sed 's/^/  /'
    echo; echo "Script for this step: ./workshop/go.sh script $n   (workshop/SCRIPT.uk.md § $(script_heading "$n"))" ;;
esac
