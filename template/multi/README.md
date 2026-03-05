# {{PROJECT_NAME}}

A Paper plugin built with Kotlin (multi-module).

## Modules

- **{{API_MODULE}}**: Shared API and interfaces
- **{{PLUGIN_MODULE}}**: Bukkit plugin implementation

## Setup

1. On Unix/macOS: `chmod +x gradlew` (make executable, if needed)
2. Build: `./gradlew build` (Unix/macOS) or `gradlew.bat build` (Windows)
3. The plugin JAR is in `{{PLUGIN_MODULE}}/build/libs/{{PROJECT_NAME}}.jar`

## Development

- Run `./gradlew shadowJar` to build the shaded JAR
- Place the JAR in your server's `plugins` folder
