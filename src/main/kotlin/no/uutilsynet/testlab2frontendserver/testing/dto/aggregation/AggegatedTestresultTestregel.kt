package no.uutilsynet.testlab2frontendserver.testing.dto.aggregation

data class AggegatedTestresultTestregel(
    val testregelId: String,
    val suksesskriterium: String,
    val fleireSuksesskriterium: List<String>,
    val talElementSamsvar: Int,
    val talElementBrot: Int,
    val compliancePercent: Int,
)
