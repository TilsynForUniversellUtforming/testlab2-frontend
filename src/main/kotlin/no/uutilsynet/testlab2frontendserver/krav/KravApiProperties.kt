package no.uutilsynet.testlab2frontendserver.krav

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "krav.api") data class KravApiProperties(val url: String)
