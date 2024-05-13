package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.sak.Brukar

data class CreateTestResultat(
    val testgrunnlagId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val nettsideId: Int?,
    val sideutvalId: Int?,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val elementOmtale: String? = null,
    val elementResultat: String? = null,
    val elementUtfall: String? = null,
    val testVartUtfoert: Instant? = null,
    val kommentar: String? = null,
) {
  init {
    require(nettsideId != null || sideutvalId != null) {
      "nettsideId må være definert for sak. sideutvalId må være definert for kontroll"
    }
  }
}
