#!/usr/bin/env bash
# PostToolUse hook — formats the file Claude just edited with Prettier.
# Receives the hook payload as JSON on stdin (tool_input.file_path).
set -uo pipefail

payload="$(cat)"
file="$(printf '%s' "$payload" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(j.tool_input?.file_path||"")}catch{process.stdout.write("")}})')"

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# Prettier honours .prettierignore; --ignore-unknown skips non-formattable files.
# Never block Claude on a formatting failure.
bunx prettier --write --ignore-unknown "$file" >/dev/null 2>&1 || true
exit 0
