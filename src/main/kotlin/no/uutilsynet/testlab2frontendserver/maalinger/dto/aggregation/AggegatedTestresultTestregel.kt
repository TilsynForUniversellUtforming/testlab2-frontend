package no.uutilsynet.testlab2frontendserver.maalinger.dto.aggregation

data class AggegatedTestresultTestregel(
    val testregelId: String,
    val suksesskriterium: String,
    val fleireSuksesskriterium: List<String>,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val talElementVarsel: Int,
    val talElementIkkjeForekomst: Int,
    val testregelGjennomsnittlegSideBrotProsent: Float?,
    val testregelGjennomsnittlegSideSamsvarProsent: Float?,
    val compliancePercent: Int
)
