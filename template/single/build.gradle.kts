{{#SOURCE_KOTLIN}}
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "{{KOTLIN_VERSION}}"
    id("com.gradleup.shadow") version "9.2.2"
}

group = "{{GROUP_ID}}"
version = "1.0-SNAPSHOT"

repositories {
    maven {
        name = "papermc"
        url = uri("https://repo.papermc.io/repository/maven-public/")
    }
    mavenCentral()
}

dependencies {
    compileOnly(libs.paper.api)
}

tasks.shadowJar {
    manifest {
        attributes["paperweight-mappings-namespace"] = "mojang"
    }
    archiveFileName.set("{{PROJECT_NAME}}.jar")
    mergeServiceFiles()
    archiveClassifier.set("")
}

kotlin {
    jvmToolchain(libs.versions.java.get().toInt())
}
{{/SOURCE_KOTLIN}}
{{#SOURCE_JAVA}}
import org.gradle.jvm.toolchain.JavaLanguageVersion

plugins {
    java
    id("com.gradleup.shadow") version "9.2.2"
}

group = "{{GROUP_ID}}"
version = "1.0-SNAPSHOT"

repositories {
    maven {
        name = "papermc"
        url = uri("https://repo.papermc.io/repository/maven-public/")
    }
    mavenCentral()
}

dependencies {
    compileOnly(libs.paper.api)
}

tasks.shadowJar {
    manifest {
        attributes["paperweight-mappings-namespace"] = "mojang"
    }
    archiveFileName.set("{{PROJECT_NAME}}.jar")
    mergeServiceFiles()
    archiveClassifier.set("")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(libs.versions.java.get()))
    }
}
{{/SOURCE_JAVA}}
