#!/usr/bin/env bash
# Stop hook — type-checks the project when Claude finishes a turn and surfaces
# any tsc errors back to Claude. Guards against infinite stop-hook loops.
set -uo pipefail

payload="$(cat)"
active="$(printf '%s' "$payload" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(String(j.stop_hook_active||false))}catch{process.stdout.write("false")}})')"

# If we already blocked once and Claude is continuing because of it, let it stop.
[ "$active" = "true" ] && exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

out="$(bun run ts:check 2>&1)" && exit 0

# Type errors present — report them to Claude and block the stop a single time.
echo "TypeScript check failed (bun run ts:check). Fix these before finishing:" >&2
echo "$out" >&2
exit 2
