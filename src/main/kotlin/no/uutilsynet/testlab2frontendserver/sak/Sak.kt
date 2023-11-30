package no.uutilsynet.testlab2frontendserver.sak

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel

data class Sak(
    val verksemd: Loeysing,
    val loeysingList: List<LoeysingNettsideRelation> = emptyList(),
    val testreglar: List<Testregel> = emptyList()
)

data class LoeysingNettsideRelation(
    val loeysing: Loeysing,
    val properties: List<NettsideProperties>
)

data class NettsideProperties(
    val type: String,
    val url: String,
    val reason: String,
    val description: String?,
)
