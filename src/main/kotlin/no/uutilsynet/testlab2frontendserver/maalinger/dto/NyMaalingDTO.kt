package no.uutilsynet.testlab2frontendserver.maalinger.dto

import no.uutilsynet.testlab2frontendserver.maalinger.dto.CrawlParameters.Companion.validateParameters

data class NyMaalingDTO(
    val navn: String,
    val loeysingIdList: List<Int>,
    val crawlParameters: CrawlParameters
)

fun MaalingInit.toNyMaalingDTO(): NyMaalingDTO =
    NyMaalingDTO(
        navn = this.navn,
        loeysingIdList = this.loeysingList.map { it.id },
        crawlParameters = crawlParameters.validateParameters())
