#!/usr/bin/env bash
# Install or update vt420 from this checkout: the dependencies, node-pty's native module, and the commands vt420,
# vt420-probe, vt420-demo, vt420-animations and vt420-setup in ~/.local/bin. Linked as vt420-update.
set -euo pipefail

ROOT="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
BIN="${VT420_BIN:-$HOME/.local/bin}"
cd "$ROOT"

if [[ "${1:-}" != "--no-pull" ]] && git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
	before="$(git rev-parse HEAD)"
	git pull --ff-only --quiet
	after="$(git rev-parse HEAD)"
	if [[ "$before" != "$after" ]]; then git log --oneline "$before..$after" | head -20; fi
fi

# the node this runs with is the one node-pty is built for, so the commands keep to it whatever node PATH finds later;
# where PATH finds one too old, the one of the last install
recent() {
	[[ -x "$1" ]] && "$1" -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 18) ? 0 : 1)'
}
node="$(readlink -f "$(command -v node || echo none)")"
if ! recent "$node"; then
	node="$(cat node_modules/.vt420-node 2>/dev/null || echo none)"
	if ! recent "$node"; then
		echo "vt420 needs node 22.18 or newer on PATH" >&2
		exit 1
	fi
fi
# its npm, and node-gyp under it, build for it
export PATH="$(dirname "$node"):$PATH"

# lifecycle scripts stay off; node-pty is the one dependency whose native module has to be built. The packages in
# packages/ are linked, and run from their sources (--conditions=source), so nothing is built for them
stamp="node_modules/.vt420-lockfile"
built="node_modules/.vt420-node"
if [[ ! -f "$stamp" ]] || ! cmp -s package-lock.json "$stamp" || [[ "$(cat "$built" 2>/dev/null)" != "$node" ]]; then
	npm ci --omit=dev --ignore-scripts --no-audit --no-fund
	npm rebuild node-pty
	cp package-lock.json "$stamp"
	echo "$node" > "$built"
fi

mkdir -p "$BIN"
for command in vt420 vt420-probe vt420-demo vt420-animations vt420-setup; do
	ln -sfn "$ROOT/bin/$command" "$BIN/$command"
done
ln -sfn "$ROOT/install.sh" "$BIN/vt420-update"
version="$("$node" -p 'require("./package.json").version')"
echo "vt420 $version from $ROOT at $(git log -1 --format='%h %s' 2>/dev/null || echo 'an unversioned copy')"
