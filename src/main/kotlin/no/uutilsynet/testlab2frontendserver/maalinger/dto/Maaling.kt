package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.time.LocalDate
import kotlin.math.roundToInt
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics.Companion.toJobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.TestresultStatus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelBaseDTO

data class Maaling(
    val id: Int,
    val navn: String,
    val datoStart: LocalDate,
    val status: MaalingStatus,
    val loeysingList: List<LoeysingVerksemd>,
    val testregelList: List<TestregelBaseDTO>,
    val crawlResultat: List<CrawlResultat>,
    val crawlStatistics: JobStatistics,
    val testResult: List<TestresultStatus>,
    val testStatistics: JobStatistics,
    val crawlParameters: CrawlParameters?,
)

fun MaalingDTO.toMaaling() = this.toMaaling(emptyList())

fun MaalingDTO.toMaaling(
    testregelList: List<TestregelBaseDTO>,
    testresultat: List<TestresultStatus> = emptyList()
): Maaling {
  val maalingTestKoeyringDTOList: List<TestKoeyringDTO> = this.testKoeyringar ?: emptyList()
  val crawlResultat = run { this.crawlResultat ?: emptyList() }.map { it.toCrawlResultat() }

  return Maaling(
      id = this.id,
      navn = this.navn,
      datoStart = this.datoStart,
      status = this.status,
      loeysingList = selectLoeysingList(crawlResultat, maalingTestKoeyringDTOList),
      testregelList = this.testregelList ?: testregelList,
      crawlResultat = crawlResultat,
      crawlStatistics = crawlResultat.map { it.type }.toJobStatistics(),
      testResult = testresultat,
      testStatistics = maalingTestKoeyringDTOList.map { it.tilstand }.toJobStatistics(),
      crawlParameters = this.crawlParameters,
  )
}

private fun MaalingDTO.selectLoeysingList(
    crawlResultat: List<CrawlResultat>,
    maalingTestKoeyringDTOList: List<TestKoeyringDTO>,
): List<LoeysingVerksemd> {
  return if (crawlResultat.isNotEmpty()) {
    crawlResultat.map { it.loeysing }
  } else if (maalingTestKoeyringDTOList.isNotEmpty()) {
    maalingTestKoeyringDTOList.map { it.loeysing }
  } else {
    this.loeysingList.orEmpty()
  }
}

fun mergeLists(
    testKoeyringList: List<TestKoeyringDTO>,
): List<TestresultStatus> {
//  val resultMap = aggregertResultatList.groupBy { it.loeysing }


    return testKoeyringList.map { testKoeyring ->
        TestresultStatus(
            loeysing = testKoeyring.loeysing,
            tilstand = testKoeyring.tilstand,
            sistOppdatert = testKoeyring.sistOppdatert,
            framgang = testKoeyring.framgang,
            aggregatedResultList = emptyList(),
            antalSider = testKoeyring.antallNettsider,
            compliancePercent = 0)
    }

//  return testKoeyringList.map { testKoeyring ->
//    val results = resultMap[testKoeyring.loeysing] ?: emptyList()
//
//    val aggregatedResultList = mutableListOf<AggegatedTestresultTestregel>()
//    val compliancePercentsForAverage = mutableListOf<Int>()
//
//    for (result in results) {
//      val compliancePercent = calculateCompliancePercentElement(result)
//
//      aggregatedResultList.add(
//          AggegatedTestresultTestregel(
//              loeysing = result.loeysing,
//              testregelId = result.testregelId,
//              suksesskriterium = result.suksesskriterium,
//              talElementSamsvar = result.talElementSamsvar,
//              talElementBrot = result.talElementBrot,
//              talElementVarsel = result.talElementVarsel,
//              talElementIkkjeForekomst = result.talElementIkkjeForekomst,
//              compliancePercent = compliancePercent,
//              testregelGjennomsnittlegSideSamsvarProsent =
//                  result.testregelGjennomsnittlegSideSamsvarProsent,
//              testregelGjennomsnittlegSideBrotProsent =
//                  result.testregelGjennomsnittlegSideBrotProsent))
//
//      if (compliancePercent != null &&
//          (result.talElementBrot != 0 || result.talElementSamsvar != 0)) {
//        compliancePercentsForAverage.add(compliancePercent)
//      }
//    }
//
//    val overallCompliancePercent =
//        if (compliancePercentsForAverage.isEmpty()) null
//        else compliancePercentsForAverage.average().roundToInt()
//
//    Testresult(
//        loeysing = testKoeyring.loeysing,
//        tilstand = testKoeyring.tilstand,
//        sistOppdatert = testKoeyring.sistOppdatert,
//        framgang = testKoeyring.framgang,
//        aggregatedResultList = aggregatedResultList,
//        antalSider = testKoeyring.antallNettsider,
//        compliancePercent = overallCompliancePercent)
//  }


    fun getTestresultatForMaaling(maaling: MaalingDTO): List<TestresultStatus> {
        val testKoeyringList = maaling.testKoeyringar ?: emptyList()
        return mergeLists(testKoeyringList)
    }
}

private fun calculateCompliancePercentElement(result: AggregertResultatDTO): Int? {
  val compliancePercent =
      result.testregelGjennomsnittlegSideSamsvarProsent?.times(100)?.roundToInt()
  return compliancePercent
}
