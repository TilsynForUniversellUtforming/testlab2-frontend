package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing

data class AggegatedTestresultTestregel(
    val loeysing: Loeysing,
    val testregelId: String,
    val suksesskriterium: String,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val talElementVarsel: Int,
    val talElementIkkjeForekomst: Int,
    val testregelGjennomsnittlegSideBrotProsent: Float?,
    val testregelGjennomsnittlegSideSamsvarProsent: Float?,
    val compliancePercent: Int
)
