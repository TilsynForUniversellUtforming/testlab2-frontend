package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

import no.uutilsynet.testlab2frontendserver.maalinger.dto.LoeysingVerksemd

data class AggegatedTestresultTestregel(
    val loeysing: LoeysingVerksemd,
    val testregelId: String,
    val suksesskriterium: String,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val talElementVarsel: Int,
    val talElementIkkjeForekomst: Int,
    val testregelGjennomsnittlegSideBrotProsent: Float?,
    val testregelGjennomsnittlegSideSamsvarProsent: Float?,
    val compliancePercent: Int?
)
