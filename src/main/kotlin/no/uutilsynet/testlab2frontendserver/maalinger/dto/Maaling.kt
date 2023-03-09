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

fun MaalingDTO.toMaaling() =
    Maaling(
        id = this.id,
        navn = this.navn,
        status = this.status,
        loeysingList =
            if (!this.crawlResultat.isNullOrEmpty()) this.crawlResultat.map { it.loeysing }
            else {
              if (this.loeysingList.isNullOrEmpty()) {
                emptyList()
              } else {
                this.loeysingList
              }
            },
        crawlResultat =
            if (this.crawlResultat.isNullOrEmpty()) emptyList()
            else this.crawlResultat.map { it.toCrawlResultat() },
        numCrawlPerforming =
            if (this.crawlResultat.isNullOrEmpty()) 0
            else this.crawlResultat.count { it.type == CrawlStatus.ikke_ferdig },
        numCrawlFinished =
            if (this.crawlResultat.isNullOrEmpty()) 0
            else this.crawlResultat.count { it.type == CrawlStatus.ferdig },
        numCrawlError =
            if (this.crawlResultat.isNullOrEmpty()) 0
            else this.crawlResultat.count { it.type == CrawlStatus.feilet },
    )
