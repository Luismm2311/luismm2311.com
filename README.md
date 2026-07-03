# Luis Alberto Moreno Portfolio

Personal portfolio served by a small Go backend using Gin.

## Structure

- `cmd/portfolio`: binary entrypoint
- `internal/server`: backend and embedded assets
- `scripts`: build utilities
- `private`: non-public files

## Requirements

- Go 1.25+

## Development

```bash
go run ./cmd/portfolio
```

The app listens on `http://127.0.0.1:8080` by default.

## Portable Linux Build

```bash
./scripts/build-linux.sh
```

The binary is generated at `dist/luis-portfolio-linux-amd64`.

## Deployment

Nginx should reverse proxy to the Go process at `127.0.0.1:8080`.

## License

The source code in this repository is licensed under the MIT License.

All personal content, including text, images, branding, resume information, project descriptions, and personal data, is not licensed for reuse and remains all rights reserved.
