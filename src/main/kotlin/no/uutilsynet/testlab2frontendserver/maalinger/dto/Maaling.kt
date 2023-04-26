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
    val testResult: List<TestKoeyring>,
    val testStatistics: JobStatistics,
    val crawlParameters: CrawlParameters?,
)

fun MaalingDTO.toMaaling() = this.toMaaling(emptyList())

fun MaalingDTO.toMaaling(
    crawlResultat: List<CrawlResultat>,
): Maaling {
  val maalingTestKoeyringList: List<TestKoeyring> = this.testKoeyringar ?: emptyList()

  return Maaling(
      id = this.id,
      navn = this.navn,
      status = this.status,
      loeysingList =
          if (crawlResultat.isNotEmpty()) {
            crawlResultat.map { it.loeysing }
          } else if (maalingTestKoeyringList.isNotEmpty()) {
            maalingTestKoeyringList.map { it.loeysing }
          } else {
            if (this.loeysingList.isNullOrEmpty()) {
              emptyList()
            } else {
              this.loeysingList
            }
          },
      crawlResultat = crawlResultat.ifEmpty { emptyList() },
      crawlStatistics = crawlResultat.map { it.type }.toJobStatistics(),
      testResult = maalingTestKoeyringList.ifEmpty { emptyList() },
      testStatistics = maalingTestKoeyringList.map { it.tilstand }.toJobStatistics(),
      crawlParameters = this.crawlParameters)
}
