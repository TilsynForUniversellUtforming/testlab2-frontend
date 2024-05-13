package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing

data class Kontroll(
    val id: Int,
    val kontrolltype: String,
    val tittel: String,
    val saksbehandler: String,
    val sakstype: String,
    val arkivreferanse: String,
    val loeysingar: List<Loeysing> = emptyList(),
    val sideutvalList: List<Sideutval> = emptyList()
)
