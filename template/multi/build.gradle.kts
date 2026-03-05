{{#SOURCE_KOTLIN}}
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "{{KOTLIN_VERSION}}"
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

allprojects {
    group = "{{GROUP_ID}}"
    version = "1.0-SNAPSHOT"

    repositories {
        maven {
            name = "papermc"
            url = uri("https://repo.papermc.io/repository/maven-public/")
        }
        mavenCentral()
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
