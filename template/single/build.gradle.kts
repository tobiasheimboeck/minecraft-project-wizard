{{#SOURCE_KOTLIN}}
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "{{KOTLIN_VERSION}}"
    id("com.gradleup.shadow") version "9.2.2"
}

val localPropertiesFile = project.file("local.properties")
val localProperties = java.util.Properties()
if (localPropertiesFile.exists()) {
    localProperties.load(java.io.FileInputStream(localPropertiesFile))
}

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

dependencies {
    compileOnly(libs.paper.api)
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
{{#DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
{{#DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
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
{{/SOURCE_KOTLIN}}
{{#SOURCE_JAVA}}
import org.gradle.jvm.toolchain.JavaLanguageVersion

plugins {
    java
    id("com.gradleup.shadow") version "9.2.2"
}

val localPropertiesFile = project.file("local.properties")
val localProperties = java.util.Properties()
if (localPropertiesFile.exists()) {
    localProperties.load(java.io.FileInputStream(localPropertiesFile))
}

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

dependencies {
    compileOnly(libs.paper.api)
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
{{#DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
    compileOnly("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_COMPILEONLY}}
{{#DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
{{/DEP_KOTLINX_SERIALIZATION_JSON_IMPLEMENTATION}}
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
{{/SOURCE_JAVA}}
