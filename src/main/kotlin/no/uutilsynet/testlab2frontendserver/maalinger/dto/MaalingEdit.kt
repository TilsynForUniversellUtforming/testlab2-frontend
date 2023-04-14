package no.uutilsynet.testlab2frontendserver.maalinger.dto

data class MaalingEdit(
    val id: Int,
    val navn: String,
    val loeysingIdList: List<Int>?,
    val crawlParameters: CrawlParameters?
)
