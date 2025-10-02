package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.time.LocalDate
import kotlin.math.roundToInt
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.JobStatistics.Companion.toJobStatistics
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggegatedTestresultTestregel
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggregertResultatDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.Testresult
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
    val testResult: List<Testresult>,
    val testStatistics: JobStatistics,
    val crawlParameters: CrawlParameters?,
)

fun MaalingDTO.toMaaling() = this.toMaaling(emptyList(), emptyList())

fun MaalingDTO.toMaaling(
    testregelList: List<TestregelBaseDTO>,
    aggregatedResult: List<AggregertResultatDTO>
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
      testResult = mergeLists(maalingTestKoeyringDTOList, aggregatedResult),
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
    aggregertResultatList: List<AggregertResultatDTO>
): List<Testresult> {
  val resultMap = aggregertResultatList.groupBy { it.loeysing }

  return testKoeyringList.map { testKoeyring ->
    val aggregatedResultList =
        resultMap[testKoeyring.loeysing]?.map { result ->
          val compliancePercent =
              result.testregelGjennomsnittlegSideSamsvarProsent?.times(100)?.roundToInt()

          AggegatedTestresultTestregel(
              loeysing = result.loeysing,
              testregelId = result.testregelId,
              suksesskriterium = result.suksesskriterium,
              talElementSamsvar = result.talElementSamsvar,
              talElementBrot = result.talElementBrot,
              talElementVarsel = result.talElementVarsel,
              talElementIkkjeForekomst = result.talElementIkkjeForekomst,
              compliancePercent = compliancePercent,
              testregelGjennomsnittlegSideSamsvarProsent =
                  result.testregelGjennomsnittlegSideSamsvarProsent,
              testregelGjennomsnittlegSideBrotProsent =
                  result.testregelGjennomsnittlegSideBrotProsent)
        }
            ?: emptyList()

    val compliancePercent =
        if (aggregatedResultList.isEmpty()) null
        else if (aggregatedResultList.all { erIkkjeForekomst(it) }) null
        else
            aggregatedResultList
                .filter { !erIkkjeForekomst(it) }
                .mapNotNull { it.compliancePercent }
                .average()
                .roundToInt()

    Testresult(
        loeysing = testKoeyring.loeysing,
        tilstand = testKoeyring.tilstand,
        sistOppdatert = testKoeyring.sistOppdatert,
        framgang = testKoeyring.framgang,
        aggregatedResultList = aggregatedResultList,
        antalSider = testKoeyring.antallNettsider,
        compliancePercent = compliancePercent)
  }
}

fun erIkkjeForekomst(resultat: AggegatedTestresultTestregel): Boolean {
  return resultat.talElementBrot == 0 && resultat.talElementSamsvar == 0
}
