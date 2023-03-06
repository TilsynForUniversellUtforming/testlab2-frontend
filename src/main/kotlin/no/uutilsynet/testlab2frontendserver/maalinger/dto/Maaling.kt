package no.uutilsynet.testlab2frontendserver.maalinger.dto

data class Maaling(
    val id: Int,
    val navn: String,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>,
    val crawlResultat: List<CrawlResultat>,
    val numCrawlPerforming: Int,
    val numCrawlFinished: Int,
    val numCrawlError: Int,
)
