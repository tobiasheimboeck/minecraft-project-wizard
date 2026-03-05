{{#SOURCE_KOTLIN}}
plugins {
    kotlin("jvm")
    id("com.gradleup.shadow") version "9.2.2"
}

dependencies {
    implementation(project(":{{API_MODULE}}"))
    implementation(libs.kotlinx.serialization.json)
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

tasks.register<Jar>("sourcesJar") {
    from(sourceSets.main.get().allSource)
    archiveClassifier.set("sources")
}
{{/SOURCE_KOTLIN}}
{{#SOURCE_JAVA}}
plugins {
    java
    id("com.gradleup.shadow") version "9.2.2"
}

dependencies {
    implementation(project(":{{API_MODULE}}"))
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

tasks.register<Jar>("sourcesJar") {
    from(sourceSets.main.get().allSource)
    archiveClassifier.set("sources")
}
{{/SOURCE_JAVA}}
