#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
cd ..

mkdir -p dist

GOOS=linux \
GOARCH="${GOARCH:-amd64}" \
CGO_ENABLED=0 \
go build -trimpath -ldflags="-s -w" -o "dist/luis-portfolio-linux-${GOARCH:-amd64}" ./cmd/portfolio
