package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.net.URL

data class CrawlResultat(
    val loeysing: Loeysing,
    val type: String,
    val statusUrl: URL?,
    val feilmelding: String?,
)
