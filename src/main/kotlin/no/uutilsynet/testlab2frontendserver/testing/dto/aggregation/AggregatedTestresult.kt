package no.uutilsynet.testlab2frontendserver.testing.dto.aggregation

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing

data class AggregatedTestresult(
    val loeysing: Loeysing,
    val testregelList: List<AggegatedTestresultTestregel>,
    val compliancePercent: Int,
)

fun List<AggregertResultatDTO>.toAggregatedTestresultList(): List<AggregatedTestresult> {
  return this.groupBy { it.loeysing }
      .map { (loeysing, aggrResultList) ->
        val testregelList =
            aggrResultList.map {
              AggegatedTestresultTestregel(
                  it.testregelId,
                  it.suksesskriterium,
                  it.fleireSuksesskriterium,
                  it.talElementSamsvar,
                  it.talElementBrot,
                  it.talElementVarsel,
                  it.talSiderSamsvar,
                  it.talSiderBrot,
                  it.talSiderIkkjeForekomst)
            }

        val totalElements =
            testregelList.sumOf { it.talElementSamsvar + it.talElementBrot + it.talElementVarsel }
        val compliancePercent =
            if (totalElements > 0) {
              (testregelList.sumOf { it.talElementSamsvar } * 100) / totalElements
            } else {
              0
            }

        AggregatedTestresult(loeysing, testregelList, compliancePercent)
      }
}
