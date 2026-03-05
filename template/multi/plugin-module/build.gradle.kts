{{#SOURCE_KOTLIN}}
plugins {
    kotlin("jvm")
    id("com.gradleup.shadow") version "9.2.2"
}

dependencies {
    implementation(project(":{{API_MODULE}}"))
{{#DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
{{#DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
{{#DEP_MCLIB_COMPILEONLY}}
    compileOnly("net.developertobi.mclib:mclib-api:1.0-SNAPSHOT")
{{/DEP_MCLIB_COMPILEONLY}}
{{#DEP_MCLIB_IMPLEMENTATION}}
    implementation("net.developertobi.mclib:mclib-api:1.0-SNAPSHOT")
{{/DEP_MCLIB_IMPLEMENTATION}}
{{#DEP_INVENTORY_LIBRARY_COMPILEONLY}}
    compileOnly("net.developertobi.inventorylib:inventory-api:1.0-SNAPSHOT")
{{/DEP_INVENTORY_LIBRARY_COMPILEONLY}}
{{#DEP_INVENTORY_LIBRARY_IMPLEMENTATION}}
    implementation("net.developertobi.inventorylib:inventory-api:1.0-SNAPSHOT")
{{/DEP_INVENTORY_LIBRARY_IMPLEMENTATION}}
{{#DEP_ENTITY_LIBRARY_COMPILEONLY}}
    compileOnly("net.developertobi.entitylib:entity-api:1.0-SNAPSHOT")
{{/DEP_ENTITY_LIBRARY_COMPILEONLY}}
{{#DEP_ENTITY_LIBRARY_IMPLEMENTATION}}
    implementation("net.developertobi.entitylib:entity-api:1.0-SNAPSHOT")
{{/DEP_ENTITY_LIBRARY_IMPLEMENTATION}}
{{#DEP_KOTLINX_COROUTINES_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
{{/DEP_KOTLINX_COROUTINES_COMPILEONLY}}
{{#DEP_KOTLINX_COROUTINES_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
{{/DEP_KOTLINX_COROUTINES_IMPLEMENTATION}}
{{#DEP_MCCOROUTINE_COMPILEONLY}}
    compileOnly("com.github.shynixn.mccoroutine:mccoroutine-bukkit-api:2.22.0")
    compileOnly("com.github.shynixn.mccoroutine:mccoroutine-bukkit-core:2.22.0")
{{/DEP_MCCOROUTINE_COMPILEONLY}}
{{#DEP_MCCOROUTINE_IMPLEMENTATION}}
    implementation("com.github.shynixn.mccoroutine:mccoroutine-bukkit-api:2.22.0")
    implementation("com.github.shynixn.mccoroutine:mccoroutine-bukkit-core:2.22.0")
{{/DEP_MCCOROUTINE_IMPLEMENTATION}}
{{#DEP_EXPOSED_COMPILEONLY}}
    compileOnly("org.jetbrains.exposed:exposed-core:1.0.0")
    compileOnly("org.jetbrains.exposed:exposed-dao:1.0.0")
    compileOnly("org.jetbrains.exposed:exposed-jdbc:1.0.0")
{{/DEP_EXPOSED_COMPILEONLY}}
{{#DEP_EXPOSED_IMPLEMENTATION}}
    implementation("org.jetbrains.exposed:exposed-core:1.0.0")
    implementation("org.jetbrains.exposed:exposed-dao:1.0.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0")
{{/DEP_EXPOSED_IMPLEMENTATION}}
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
{{#DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
{{#DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
{{#DEP_MCLIB_COMPILEONLY}}
    compileOnly("net.developertobi.mclib:mclib-api:1.0-SNAPSHOT")
{{/DEP_MCLIB_COMPILEONLY}}
{{#DEP_MCLIB_IMPLEMENTATION}}
    implementation("net.developertobi.mclib:mclib-api:1.0-SNAPSHOT")
{{/DEP_MCLIB_IMPLEMENTATION}}
{{#DEP_INVENTORY_LIBRARY_COMPILEONLY}}
    compileOnly("net.developertobi.inventorylib:inventory-api:1.0-SNAPSHOT")
{{/DEP_INVENTORY_LIBRARY_COMPILEONLY}}
{{#DEP_INVENTORY_LIBRARY_IMPLEMENTATION}}
    implementation("net.developertobi.inventorylib:inventory-api:1.0-SNAPSHOT")
{{/DEP_INVENTORY_LIBRARY_IMPLEMENTATION}}
{{#DEP_ENTITY_LIBRARY_COMPILEONLY}}
    compileOnly("net.developertobi.entitylib:entity-api:1.0-SNAPSHOT")
{{/DEP_ENTITY_LIBRARY_COMPILEONLY}}
{{#DEP_ENTITY_LIBRARY_IMPLEMENTATION}}
    implementation("net.developertobi.entitylib:entity-api:1.0-SNAPSHOT")
{{/DEP_ENTITY_LIBRARY_IMPLEMENTATION}}
{{#DEP_KOTLINX_COROUTINES_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
{{/DEP_KOTLINX_COROUTINES_COMPILEONLY}}
{{#DEP_KOTLINX_COROUTINES_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
{{/DEP_KOTLINX_COROUTINES_IMPLEMENTATION}}
{{#DEP_MCCOROUTINE_COMPILEONLY}}
    compileOnly("com.github.shynixn.mccoroutine:mccoroutine-bukkit-api:2.22.0")
    compileOnly("com.github.shynixn.mccoroutine:mccoroutine-bukkit-core:2.22.0")
{{/DEP_MCCOROUTINE_COMPILEONLY}}
{{#DEP_MCCOROUTINE_IMPLEMENTATION}}
    implementation("com.github.shynixn.mccoroutine:mccoroutine-bukkit-api:2.22.0")
    implementation("com.github.shynixn.mccoroutine:mccoroutine-bukkit-core:2.22.0")
{{/DEP_MCCOROUTINE_IMPLEMENTATION}}
{{#DEP_EXPOSED_COMPILEONLY}}
    compileOnly("org.jetbrains.exposed:exposed-core:1.0.0")
    compileOnly("org.jetbrains.exposed:exposed-dao:1.0.0")
    compileOnly("org.jetbrains.exposed:exposed-jdbc:1.0.0")
{{/DEP_EXPOSED_COMPILEONLY}}
{{#DEP_EXPOSED_IMPLEMENTATION}}
    implementation("org.jetbrains.exposed:exposed-core:1.0.0")
    implementation("org.jetbrains.exposed:exposed-dao:1.0.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0")
{{/DEP_EXPOSED_IMPLEMENTATION}}
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
