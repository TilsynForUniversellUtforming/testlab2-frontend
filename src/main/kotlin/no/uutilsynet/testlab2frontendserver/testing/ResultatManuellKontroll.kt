package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.sak.Brukar

data class ResultatManuellKontroll(
    val id: Int,
    val sakId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val nettsideId: Int,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val elementOmtale: String?,
    val elementResultat: ElementResultat?,
    val elementUtfall: String?,
    val svar: List<Svar>,
    val testVartUtfoert: Instant?,
    val status: Status = Status.IkkjePaabegynt,
    val kommentar: String?,
) {
  data class Svar(val steg: String, val svar: String)

  enum class Status {
    IkkjePaabegynt,
    UnderArbeid,
    Ferdig,
    Deaktivert
  }
}
