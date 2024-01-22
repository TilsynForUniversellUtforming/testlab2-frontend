package no.uutilsynet.testlab2frontendserver.maalinger.dummy

import kotlin.random.Random
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.maalinger.dto.MaalingDTO
import no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation.AggregertResultatDTO

object AggregertResultatDTODummy {
  fun generateAggregertResultatDTODummyList(maaling: MaalingDTO): List<AggregertResultatDTO> {

    val maalingLoeysingResult =
        maaling.crawlResultat?.map { Pair(it.loeysing, it.antallNettsider ?: 0) }
            ?: maaling.testKoeyringar?.map {
              Pair(it.loeysing, it.crawlResultat.antallNettsider ?: 0)
            }
                ?: emptyList()

    return maalingLoeysingResult
        .map { generateAggregertResultatDTODummyList(maaling.id, it.first, it.second) }
        .flatten()
  }

  private fun generateAggregertResultatDTODummyList(
      maalingId: Int,
      loeysing: Loeysing,
      pagesCrawled: Int,
  ): List<AggregertResultatDTO> {
    val testregelIds =
        listOf(
            "QW-ACT-R13",
            "QW-ACT-R35",
            "QW-ACT-R12",
            "QW-ACT-R18",
            "QW-ACT-R65",
            "QW-ACT-R37",
            "QW-ACT-R20",
            "QW-ACT-R22",
            "QW-ACT-R17",
            "QW-ACT-R2",
            "QW-ACT-R28",
            "QW-ACT-R14",
            "QW-ACT-R1",
            "QW-ACT-R11",
            "QW-ACT-R5",
            "QW-ACT-R43")

    val suksesskriteriums =
        listOf(
            "4.1.2",
            "1.3.1",
            "2.4.4",
            "4.1.1",
            "4.1.2",
            "1.4.3",
            "1.3.1",
            "3.1.2",
            "1.1.1",
            "3.1.1",
            "4.1.2",
            "1.4.4",
            "2.4.2",
            "4.1.2",
            "3.1.1",
            "2.1.1")

    val fleireSuksesskriteriums =
        listOf(
            listOf("4.1.2"),
            listOf("1.3.1"),
            listOf("2.4.4", "2.4.9", "4.1.2"),
            listOf("4.1.1"),
            listOf("4.1.2"),
            listOf("1.4.3", "1.4.6"),
            listOf("1.3.1"),
            listOf("3.1.2"),
            listOf("1.1.1"),
            listOf("3.1.1"),
            listOf("4.1.2"),
            listOf("1.4.4"),
            listOf("2.4.2"),
            listOf("4.1.2"),
            listOf("3.1.1"),
            listOf("2.1.1", "2.1.3"))

    return testregelIds
        .mapIndexed { index, testregelId ->
          val pagesSuccess = Random.nextInt(0, pagesCrawled)
          AggregertResultatDTO(
              maalingId = maalingId,
              loeysing = loeysing,
              testregelId = testregelId,
              suksesskriterium = suksesskriteriums[index],
              fleireSuksesskriterium = fleireSuksesskriteriums[index],
              talElementSamsvar = Random.nextInt(0, 100),
              talElementVarsel = 0,
              talSiderSamsvar = pagesSuccess,
              talSiderBrot = pagesCrawled - pagesSuccess,
              talSiderIkkjeForekomst = 0,
              talElementBrot = Random.nextInt(0, 100))
        }
        .sortedWith(
            compareBy({ it.loeysing.id }, { it.testregelId.replace("QW-ACT-R", "").toInt() }))
  }
}
