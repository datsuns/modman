.PHONY: dev build install run

# Install dependencies
install:
	npm install

# Run the app in development mode
dev:
	npm run tauri dev

# Alias for dev
run: dev

# Build the app for production
build:
	npm run tauri build

# Lint the project
lint:
	npm run lint
