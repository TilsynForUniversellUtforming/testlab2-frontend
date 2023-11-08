package no.uutilsynet.testlab2frontendserver.common

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "loeysingsregister.api")
data class LoeysingsregisterApiProperties(val url: String)
