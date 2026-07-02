#!/usr/bin/env bash
set -euo pipefail

# n8n-node dev always fetches `n8n@latest` via npx, which currently crashes on
# startup (upstream bug: @n8n/backend-common looks for the "breaking-changes"
# module at a `.ee`-suffixed path that the n8n package doesn't ship, see
# https://github.com/n8n-io/n8n). Until that's fixed, run n8n externally
# pinned to a known-good version instead of letting node-cli fetch @latest.
N8N_VERSION="2.27.5"

export N8N_DEV_RELOAD=true
export N8N_USER_FOLDER="${N8N_USER_FOLDER:-$HOME/.n8n-node-cli}"

n8n-node dev --external-n8n &
node_cli_pid=$!
trap 'kill "$node_cli_pid" 2>/dev/null' EXIT

npx -y --color=always "n8n@$N8N_VERSION"
