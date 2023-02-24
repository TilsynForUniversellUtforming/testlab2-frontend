package no.uutilsynet.testlab2frontendserver.maalinger.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Maaling(
    val id: Int,
    val navn: String,
    val status: String,
    val loeysingList: List<Loeysing>?,
    val crawlResultat: List<CrawlResultat>?
)
