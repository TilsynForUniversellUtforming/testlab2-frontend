package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.net.URL
import java.time.LocalDateTime
import no.uutilsynet.testlab2frontendserver.common.TimeUtil.toLocalDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CrawlResultat(
    val loeysing: Loeysing,
    val type: JobStatus,
    val sistOppdatert: LocalDateTime,
    val feilmelding: String?,
    val urlList: List<URL>?,
    val framgang: Framgang?
)

data class Framgang(val lenkerCrawla: Int, val maxLenker: Int)

fun CrawlResultatDTO.toCrawlResultat() =
    CrawlResultat(
        this.loeysing,
        this.type,
        this.sistOppdatert.toLocalDateTime(),
        this.feilmelding,
        this.nettsider,
        this.framgang)
