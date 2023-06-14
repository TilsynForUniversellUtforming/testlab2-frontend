package no.uutilsynet.testlab2frontendserver.maalinger.dto

data class MaalingInit(
    val navn: String,
    val loeysingIdList: List<Int>,
    val testregelIdList: List<Int>,
    val crawlParameters: CrawlParameters
)
