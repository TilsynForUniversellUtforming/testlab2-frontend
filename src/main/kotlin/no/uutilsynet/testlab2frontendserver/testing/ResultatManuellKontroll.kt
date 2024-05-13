package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.sak.Brukar

data class ResultatManuellKontroll(
    val id: Int,
    val testgrunnlagId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val nettsideId: Int?,
    val sideutvalId: Int?,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val elementOmtale: String?,
    val elementResultat: ElementResultat?,
    val elementUtfall: String?,
    val svar: List<Svar>,
    val testVartUtfoert: Instant?,
    val status: Status = Status.IkkjePaabegynt,
    val kommentar: String?,
) {
  init {
    require(nettsideId != null || sideutvalId != null) {
      "nettsideId må være definert for sak. sideutvalId må være definert for kontroll"
    }
  }

  data class Svar(val steg: String, val svar: String)

  enum class Status {
    IkkjePaabegynt,
    UnderArbeid,
    Ferdig,
    Deaktivert
  }
}
