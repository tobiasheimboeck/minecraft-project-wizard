{{#SOURCE_KOTLIN}}
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "{{KOTLIN_VERSION}}"
}

val localPropertiesFile = rootProject.file("local.properties")
val localProperties = java.util.Properties()
if (localPropertiesFile.exists()) {
    localProperties.load(java.io.FileInputStream(localPropertiesFile))
}

allprojects {
    group = "{{GROUP_ID}}"
    version = "1.0-SNAPSHOT"

    repositories {
        maven {
            name = "papermc"
            url = uri("https://repo.papermc.io/repository/maven-public/")
        }
        mavenCentral()
{{#DEP_MCLIB}}
        maven {
            name = "mclib"
            url = uri("https://maven.pkg.github.com/DeveloperTobi/mc-lib")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_MCLIB}}
{{#DEP_INVENTORY_LIBRARY}}
        maven {
            name = "inventory-library"
            url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/inventory-library")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_INVENTORY_LIBRARY}}
{{#DEP_ENTITY_LIBRARY}}
        maven {
            name = "entity-library"
            url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/entity-library")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_ENTITY_LIBRARY}}
{{#DEP_MCCOROUTINE}}
        maven {
            name = "jitpack"
            url = uri("https://jitpack.io")
        }
{{/DEP_MCCOROUTINE}}
    }

    apply(plugin = "java")
    apply(plugin = "maven-publish")

    afterEvaluate {
        dependencies {
            compileOnly(libs.paper.api)
        }
    }
}

tasks.jar {
    manifest {
        attributes["paperweight-mappings-namespace"] = "mojang"
    }
}

kotlin {
    jvmToolchain(libs.versions.java.get().toInt())
}
{{/SOURCE_KOTLIN}}
{{#SOURCE_JAVA}}
import org.gradle.jvm.toolchain.JavaLanguageVersion

plugins {
    java
}

val localPropertiesFile = rootProject.file("local.properties")
val localProperties = java.util.Properties()
if (localPropertiesFile.exists()) {
    localProperties.load(java.io.FileInputStream(localPropertiesFile))
}

allprojects {
    group = "{{GROUP_ID}}"
    version = "1.0-SNAPSHOT"

    repositories {
        maven {
            name = "papermc"
            url = uri("https://repo.papermc.io/repository/maven-public/")
        }
        mavenCentral()
{{#DEP_MCLIB}}
        maven {
            name = "mclib"
            url = uri("https://maven.pkg.github.com/DeveloperTobi/mc-lib")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_MCLIB}}
{{#DEP_INVENTORY_LIBRARY}}
        maven {
            name = "inventory-library"
            url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/inventory-library")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_INVENTORY_LIBRARY}}
{{#DEP_ENTITY_LIBRARY}}
        maven {
            name = "entity-library"
            url = uri("https://maven.pkg.github.com/DeveloperTobi-Server/entity-library")
            credentials {
                username = localProperties.getProperty("gpr.user") ?: System.getenv("GPR_USER") ?: ""
                password = localProperties.getProperty("gpr.key") ?: System.getenv("GPR_KEY") ?: ""
            }
        }
{{/DEP_ENTITY_LIBRARY}}
{{#DEP_MCCOROUTINE}}
        maven {
            name = "jitpack"
            url = uri("https://jitpack.io")
        }
{{/DEP_MCCOROUTINE}}
    }

    apply(plugin = "java")
    apply(plugin = "maven-publish")

    afterEvaluate {
        dependencies {
            compileOnly(libs.paper.api)
        }
    }
}

tasks.jar {
    manifest {
        attributes["paperweight-mappings-namespace"] = "mojang"
    }
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(libs.versions.java.get()))
    }
}
{{/SOURCE_JAVA}}
