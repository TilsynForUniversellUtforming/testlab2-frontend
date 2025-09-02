package no.uutilsynet.testlab2frontendserver.kontroll

import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting

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

data class KontrollTestingMetadata(
    val innhaldstypeTesting: List<InnhaldstypeTesting>,
    val sideutvalList: List<KontrollResource.SideutvalType>
)
