package no.uutilsynet.testlab2frontendserver.maalinger.dto

import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics.Companion.toJobStatistics

data class Maaling(
    val id: Int,
    val navn: String,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>,
    val crawlResultat: List<CrawlResultat>,
    val crawlStatistics: JobStatistics,
    val testStatistics: JobStatistics,
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
        crawlStatistics = this.crawlResultat?.map { it.type }?.toJobStatistics()
                ?: JobStatistics(0, 0, 0),
        testStatistics = JobStatistics(0, 0, 0),
    )
