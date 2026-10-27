package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2.constants.TestresultatUtfall
import no.uutilsynet.testlab2frontendserver.common.Brukar

data class ResultatManuellKontroll(
    val id: Int,
    val testgrunnlagId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val sideutvalId: Int,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val element: Element? = null,
    val svar: List<Svar>,
    val testVartUtfoert: Instant?,
    val status: ResultatStatus = ResultatStatus.IkkjePaabegynt,
    val kommentar: String?,
    val sistLagra: Instant,
    val ekstraSjekk: Boolean = false,
) {
  data class Svar(val steg: String, val svar: String)
}

enum class ResultatStatus {
  IkkjePaabegynt,
  UnderArbeid,
  Ferdig,
  Deaktivert
}

data class Element(
    val elementOmtale: String?,
    val elementResultat: TestresultatUtfall?,
    val elementUtfall: String?,
    val elementUtfallId: Int? = null,
    val elementOmtaleHtml: String? = null,
    val elementPlassering: String? = null,
)
