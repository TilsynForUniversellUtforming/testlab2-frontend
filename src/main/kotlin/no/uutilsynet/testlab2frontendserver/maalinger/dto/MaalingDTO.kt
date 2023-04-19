package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MaalingDTO(
    val id: Int,
    val navn: String,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>?,
    val crawlResultat: List<CrawlResultatDTO>?,
    val testKoeyringar: List<TestKoeyring>?,
    val crawlParameters: CrawlParameters?,
)
