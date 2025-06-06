package no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat

import java.net.URL
import java.time.LocalDateTime
import no.uutilsynet.testlab2frontendserver.testing.Bilde

data class TestResultat(
    val suksesskriterium: List<String>,
    val side: URL,
    val testregelId: Int,
    val testregelNoekkel: String,
    val sideNivaa: Int,
    val testVartUtfoert: LocalDateTime?,
    val elementUtfall: String,
    val elementResultat: String,
    val elementOmtale: ElementOmtale? = null,
    val kommentar: String?,
    val bilder: List<Bilde>?
)
