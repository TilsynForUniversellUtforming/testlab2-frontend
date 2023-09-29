package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime
import no.uutilsynet.testlab2frontendserver.common.TimeUtil.toLocalDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CrawlResultat(
    val loeysing: Loeysing,
    val type: JobStatus,
    val sistOppdatert: LocalDateTime,
    val feilmelding: String?,
    val antallNettsider: Int,
    val framgang: Framgang?
)

fun CrawlResultatDTO.toCrawlResultat() =
    CrawlResultat(
        this.loeysing,
        if (this.type == JobStatus.ikke_ferdig) JobStatus.crawler else this.type,
        this.sistOppdatert.toLocalDateTime(),
        this.feilmelding,
        this.antallNettsider ?: 0,
        this.framgang)
