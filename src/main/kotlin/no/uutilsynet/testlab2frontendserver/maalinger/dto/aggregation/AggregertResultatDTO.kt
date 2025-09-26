package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

import no.uutilsynet.testlab2frontendserver.maalinger.dto.LoeysingVerksemd

data class AggregertResultatDTO(
    val maalingId: Int,
    val loeysing: LoeysingVerksemd,
    val testregelId: String,
    val suksesskriterium: String,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val talElementVarsel: Int,
    val talElementIkkjeForekomst: Int,
    val talSiderSamsvar: Int,
    val talSiderBrot: Int,
    val talSiderIkkjeForekomst: Int,
    val testregelGjennomsnittlegSideSamsvarProsent: Float?,
    val testregelGjennomsnittlegSideBrotProsent: Float?,
)
