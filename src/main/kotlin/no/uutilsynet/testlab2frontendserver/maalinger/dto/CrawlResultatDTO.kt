package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.net.URL

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CrawlResultatDTO(
    val loeysing: Loeysing,
    val type: JobStatus,
    val statusUrl: URL?,
    val feilmelding: String?,
    val nettsider: List<URL>?,
)
