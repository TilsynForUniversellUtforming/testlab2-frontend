package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.time.LocalDate
import kotlin.math.roundToInt
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics.Companion.toJobStatistics
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.AggegatedTestresultTestregel
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.testing.dto.aggregation.Testresult
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel

data class Maaling(
    val id: Int,
    val navn: String,
    val datoStart: LocalDate,
    val status: MaalingStatus,
    val loeysingList: List<Loeysing>,
    val testregelList: List<Testregel>,
    val crawlResultat: List<CrawlResultat>,
    val crawlStatistics: JobStatistics,
    val testResult: List<Testresult>,
    val testStatistics: JobStatistics,
    val crawlParameters: CrawlParameters?,
)

fun MaalingDTO.toMaaling() = this.toMaaling(emptyList(), emptyList())

fun MaalingDTO.toMaaling(
    testregelList: List<Testregel>,
    aggregatedResult: List<AggregertResultatDTO>
): Maaling {
  val maalingTestKoeyringDTOList: List<TestKoeyringDTO> = this.testKoeyringar ?: emptyList()
  val crawlResultat =
      run { this.crawlResultat ?: this.testKoeyringar?.map { it.crawlResultat } ?: emptyList() }
          .map { it.toCrawlResultat() }

  return Maaling(
      id = this.id,
      navn = this.navn,
      datoStart = this.datoStart,
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
                if (it.type == JobStatus.ferdig && it.antallNettsider == 0) JobStatus.feilet
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
          val totalPages =
              result.talSiderSamsvar + result.talSiderBrot + result.talSiderIkkjeForekomst
          val compliancePercent =
              if (totalPages > 0) {
                val compliantPages = result.talSiderSamsvar + result.talSiderIkkjeForekomst
                ((compliantPages.toDouble() / totalPages) * 100).roundToInt()
              } else {
                100
              }

          AggegatedTestresultTestregel(
              testregelId = result.testregelId,
              suksesskriterium = result.suksesskriterium,
              fleireSuksesskriterium = result.fleireSuksesskriterium,
              talElementSamsvar = result.talElementSamsvar,
              talElementBrot = result.talElementBrot,
              talElementVarsel = result.talElementVarsel,
              talSiderSamsvar = result.talSiderSamsvar,
              talSiderBrot = result.talSiderBrot,
              talSiderIkkjeForekomst = result.talSiderIkkjeForekomst,
              compliancePercent = compliancePercent)
        }
            ?: emptyList()

    val compliancePercent =
        if (aggregatedResultList.isEmpty()) 100
        else aggregatedResultList.map { it.compliancePercent.toDouble() }.average().roundToInt()

    Testresult(
        loeysing = testKoeyring.loeysing,
        tilstand = testKoeyring.tilstand,
        sistOppdatert = testKoeyring.sistOppdatert,
        framgang = testKoeyring.framgang,
        aggregatedResultList = aggregatedResultList,
        antalSider = testKoeyring.crawlResultat.antallNettsider,
        compliancePercent = compliancePercent)
  }
}
