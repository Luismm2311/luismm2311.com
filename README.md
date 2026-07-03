# Luis Alberto Moreno Portfolio

Portfolio personal servido por un backend pequeno en Go con Gin.

## Estructura

- `cmd/portfolio`: entrypoint del binario
- `internal/server`: backend y assets embebidos
- `scripts`: utilidades de build
- `private`: archivos no publicos

## Requisitos

- Go 1.25+

## Desarrollo

```bash
go run ./cmd/portfolio
```

La app escucha en `http://127.0.0.1:8080` por defecto.

## Build Linux portable

```bash
./scripts/build-linux.sh
```

El binario queda en `dist/luis-portfolio-linux-amd64`.

## Despliegue

Nginx debe hacer reverse proxy al proceso Go en `127.0.0.1:8080`.
