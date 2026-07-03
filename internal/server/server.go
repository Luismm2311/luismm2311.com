package server

import (
	"embed"
	"encoding/json"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

type catalog map[string]map[string]string

//go:embed web/index.html web/app.js web/style.css web/locales.json web/*.svg
var assets embed.FS

func Run() error {
	locales, err := loadLocales()
	if err != nil {
		return err
	}

	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	if err := router.SetTrustedProxies(nil); err != nil {
		return err
	}

	router.GET("/api/lang", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"lang": languageFromHeader(c.GetHeader("Accept-Language"))})
	})

	router.GET("/api/i18n/:lang", func(c *gin.Context) {
		lang := normalizeLang(c.Param("lang"))
		c.Header("Cache-Control", "public, max-age=3600")
		c.JSON(http.StatusOK, gin.H{
			"lang":     lang,
			"messages": locales[lang],
		})
	})

	router.GET("/", func(c *gin.Context) {
		serveAsset(c, "web/index.html")
	})
	router.GET("/index.html", func(c *gin.Context) {
		serveAsset(c, "web/index.html")
	})
	router.GET("/app.js", func(c *gin.Context) {
		serveAsset(c, "web/app.js")
	})
	router.GET("/style.css", func(c *gin.Context) {
		serveAsset(c, "web/style.css")
	})
	router.GET("/Logo LAMM V3.1.svg", func(c *gin.Context) {
		serveAsset(c, "web/Logo LAMM V3.1.svg")
	})

	return router.Run(":" + port())
}

func serveAsset(c *gin.Context, name string) {
	data, err := assets.ReadFile(name)
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}
	c.Data(http.StatusOK, contentType(name), data)
}

func loadLocales() (catalog, error) {
	data, err := assets.ReadFile("web/locales.json")
	if err != nil {
		return nil, err
	}

	var locales catalog
	if err := json.Unmarshal(data, &locales); err != nil {
		return nil, err
	}

	return locales, nil
}

func normalizeLang(lang string) string {
	switch strings.ToLower(lang) {
	case "es", "es-mx", "es-es":
		return "es"
	default:
		return "en"
	}
}

func languageFromHeader(header string) string {
	for part := range strings.SplitSeq(header, ",") {
		if lang := normalizeLang(strings.TrimSpace(strings.Split(part, ";")[0])); lang == "es" {
			return lang
		}
	}

	return "en"
}

func port() string {
	if port := strings.TrimSpace(strings.TrimPrefix(os.Getenv("PORT"), ":")); port != "" {
		return port
	}
	return "8080"
}

func contentType(name string) string {
	switch path.Ext(name) {
	case ".html":
		return "text/html; charset=utf-8"
	case ".js":
		return "application/javascript; charset=utf-8"
	case ".css":
		return "text/css; charset=utf-8"
	case ".svg":
		return "image/svg+xml"
	default:
		return "application/octet-stream"
	}
}
