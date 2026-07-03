package main

import (
	"log"

	"luismm2311.com/v3/internal/server"
)

func main() {
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
