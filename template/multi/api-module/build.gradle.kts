plugins {
    kotlin("jvm")
    `maven-publish`
}

val localPropertiesFile = rootProject.file("local.properties")
val localProperties = java.util.Properties()
if (localPropertiesFile.exists()) {
    localProperties.load(java.io.FileInputStream(localPropertiesFile))
    localProperties.forEach { (key, value) ->
        project.extensions.extraProperties.set(key.toString(), value)
    }
}

dependencies {

}

kotlin {
    jvmToolchain(libs.versions.java.get().toInt())
}

tasks.register<Jar>("sourcesJar") {
    from(sourceSets.main.get().allSource)
    archiveClassifier.set("sources")
}

{{#GITHUB_PUBLISH}}
publishing {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/{{GITHUB_OWNER}}/{{PROJECT_NAME}}")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
    }
    publications {
        register<MavenPublication>("gpr") {
            from(components["java"])
        }
    }
}
{{/GITHUB_PUBLISH}}
