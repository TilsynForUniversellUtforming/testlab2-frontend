package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.net.URL

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CrawlResultat(
    val loeysing: Loeysing,
    val type: JobStatus,
    val feilmelding: String?,
    val urlList: List<URL>?
)

fun CrawlResultatDTO.toCrawlResultat() =
    CrawlResultat(this.loeysing, this.type, this.feilmelding, this.nettsider)
