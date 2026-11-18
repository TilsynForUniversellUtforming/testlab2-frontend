package no.uutilsynet.testlab2frontendserver.testing

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.Brukar

data class CreateTestResultat(
    val testgrunnlagId: Int,
    val loeysingId: Int,
    val testregelId: Int,
    val sideutvalId: Int,
    val brukar: Brukar = Brukar("testesen@digdir.no", "Test Testesen"),
    val element: Element? = null,
    val testVartUtfoert: Instant? = null,
    val kommentar: String? = null,
    val imageDataUrl: String? = null,
    val ekstraSjekk: Boolean = false,
)
