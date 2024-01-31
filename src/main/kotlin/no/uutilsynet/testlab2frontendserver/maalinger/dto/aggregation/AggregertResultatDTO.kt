package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing

data class AggregertResultatDTO(
    val maalingId: Int,
    val loeysing: Loeysing,
    val testregelId: String,
    val suksesskriterium: String,
    val fleireSuksesskriterium: List<String>,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val talElementVarsel: Int,
    val talSiderSamsvar: Int,
    val talSiderBrot: Int,
    val talSiderIkkjeForekomst: Int,
    val testregelGjennomsnittlegSideSamsvarProsent: Float?,
    val testregelGjennomsnittlegSideBrotProsent: Float?,
)
