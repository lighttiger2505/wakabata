package config

import (
	"log"
	"sync"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Port string `envconfig:"PORT" default:"8088"`
}

var (
	config *Config
	once   sync.Once
)

func loadConfig() *Config {
	var cfg Config
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	log.Printf("Configuration loaded successfully - Port: %s", cfg.Port)
	return &cfg
}

func Get() *Config {
	once.Do(func() {
		config = loadConfig()
	})
	return config
}

