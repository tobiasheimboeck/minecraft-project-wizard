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
