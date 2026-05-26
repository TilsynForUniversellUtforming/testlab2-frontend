package no.uutilsynet.testlab2frontendserver.kontroll

import java.time.LocalDate
import no.uutilsynet.testlab2.constants.Kontrolltype
import no.uutilsynet.testlab2.constants.Sakstype
import no.uutilsynet.testlab2frontendserver.maalinger.dto.Loeysing
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.utval.UtvalResource

data class Kontroll(
    val id: Int,
    val kontrolltype: Kontrolltype,
    val tittel: String,
    val saksbehandler: String,
    val sakstype: Sakstype,
    val arkivreferanse: String,
    val loeysingar: List<Loeysing> = emptyList(),
    val utval: UtvalResource.Utval? = null,
    val sideutvalList: List<Sideutval> = emptyList(),
    val opprettaDato: LocalDate = LocalDate.now(),
)

data class KontrollTestingMetadata(
    val innhaldstypeTesting: List<InnhaldstypeTesting>,
    val sideutvalList: List<KontrollResource.SideutvalType>
)
