#!/bin/sh
set -eu

template="/etc/nginx/config.js.template"
target="/usr/share/nginx/html/config.js"

if [ -f "$template" ]; then
  export VITE_API_URL="${VITE_API_URL:-http://localhost:5002/api}"
  envsubst '$VITE_API_URL' < "$template" > "$target"
  echo "Injected VITE_API_URL into $target"
fi