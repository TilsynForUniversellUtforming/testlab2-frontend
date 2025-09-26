package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.net.URL
import java.time.Instant

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CrawlResultatDTO(
    val loeysing: LoeysingVerksemd,
    val sistOppdatert: Instant,
    val type: JobStatus,
    val statusUrl: URL?,
    val feilmelding: String?,
    val antallNettsider: Int?,
    val framgang: Framgang?
)
