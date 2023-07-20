package no.uutilsynet.testlab2frontendserver.maalinger.dto

import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics.Companion.toJobStatistics
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.AggegatedTestresultTestregel
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.Testresult

data class Maaling(
    val id: Int,
    val navn: String,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>,
    val testregelList: List<Testregel>,
    val crawlResultat: List<CrawlResultat>,
    val crawlStatistics: JobStatistics,
    val testResult: List<Testresult>,
    val testStatistics: JobStatistics,
    val crawlParameters: CrawlParameters?,
)

fun MaalingDTO.toMaaling() = this.toMaaling(emptyList(), emptyList(), emptyList())

fun MaalingDTO.toMaaling(
    crawlResultat: List<CrawlResultat>,
    testregelList: List<Testregel>,
    aggregatedResult: List<AggregertResultatDTO>
): Maaling {
  val maalingTestKoeyringDTOList: List<TestKoeyringDTO> = this.testKoeyringar ?: emptyList()

  return Maaling(
      id = this.id,
      navn = this.navn,
      status = this.status,
      loeysingList =
          if (crawlResultat.isNotEmpty()) {
            crawlResultat.map { it.loeysing }
          } else if (maalingTestKoeyringDTOList.isNotEmpty()) {
            maalingTestKoeyringDTOList.map { it.loeysing }
          } else {
            if (this.loeysingList.isNullOrEmpty()) {
              emptyList()
            } else {
              this.loeysingList
            }
          },
      testregelList = this.testregelList ?: testregelList,
      crawlResultat = crawlResultat,
      crawlStatistics =
          crawlResultat
              .map {
                if (it.type == JobStatus.ferdig && it.urlList.isNullOrEmpty()) JobStatus.feilet
                else it.type
              }
              .toJobStatistics(),
      testResult = mergeLists(maalingTestKoeyringDTOList, aggregatedResult),
      testStatistics = maalingTestKoeyringDTOList.map { it.tilstand }.toJobStatistics(),
      crawlParameters = this.crawlParameters,
  )
}

fun mergeLists(
    testKoeyringList: List<TestKoeyringDTO>,
    aggregertResultatList: List<AggregertResultatDTO>
): List<Testresult> {
  val resultMap = aggregertResultatList.groupBy { it.loeysing }

  return testKoeyringList.map { testKoeyring ->
    val aggregatedResultList =
        resultMap[testKoeyring.loeysing]?.map { result ->
          AggegatedTestresultTestregel(
              testregelId = result.testregelId,
              suksesskriterium = result.suksesskriterium,
              fleireSuksesskriterium = result.fleireSuksesskriterium,
              talElementSamsvar = result.talElementSamsvar,
              talElementBrot = result.talElementBrot,
              talElementVarsel = result.talElementVarsel,
              talSiderSamsvar = result.talSiderSamsvar,
              talSiderBrot = result.talSiderBrot,
              talSiderIkkjeForekomst = result.talSiderIkkjeForekomst)
        }

    val compliancePercent =
        aggregatedResultList?.let { resultList ->
          val totalElements =
              resultList.sumOf { it.talElementSamsvar + it.talElementBrot + it.talElementVarsel }
          if (totalElements > 0) {
            (resultList.sumOf { it.talElementSamsvar } * 100) / totalElements
          } else {
            0
          }
        }

    Testresult(
        loeysing = testKoeyring.loeysing,
        tilstand = testKoeyring.tilstand,
        sistOppdatert = testKoeyring.sistOppdatert,
        framgang = testKoeyring.framgang,
        aggregatedResultList = aggregatedResultList,
        compliancePercent = compliancePercent)
  }
}
