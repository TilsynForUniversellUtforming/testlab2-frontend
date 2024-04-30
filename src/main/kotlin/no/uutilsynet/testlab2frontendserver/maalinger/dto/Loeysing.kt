package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.net.URL
import no.uutilsynet.testlab2frontendserver.verksemd.Verksemd

data class Loeysing(
    val id: Int,
    val namn: String,
    val url: URL,
    val orgnummer: String?,
    val verksemdId: Int?
)

data class LoeysingFormElement(
    val id: Int,
    val namn: String,
    val url: URL,
    val orgnummer: String?,
    val verksemd: Verksemd?
)
