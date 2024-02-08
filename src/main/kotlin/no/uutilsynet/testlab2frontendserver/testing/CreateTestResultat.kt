package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.sak.Brukar

data class CreateTestResultat(
    val testgrunnlagId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val nettsideId: Int,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val elementOmtale: String? = null,
    val elementResultat: String? = null,
    val elementUtfall: String? = null,
    val testVartUtfoert: Instant? = null,
    val kommentar: String? = null,
)
