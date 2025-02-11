package no.uutilsynet.testlab2frontendserver.common

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "testing.api")
data class TestingApiProperties(val url: String, val key: String = "", val headerName: String = "Authorization")
