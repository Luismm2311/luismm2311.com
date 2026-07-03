package server

import "testing"

func TestLanguageFromHeader(t *testing.T) {
	if got := languageFromHeader("es-MX,es;q=0.9,en;q=0.8"); got != "es" {
		t.Fatalf("expected es, got %s", got)
	}

	if got := languageFromHeader("fr-FR,fr;q=0.9"); got != "en" {
		t.Fatalf("expected en fallback, got %s", got)
	}
}
