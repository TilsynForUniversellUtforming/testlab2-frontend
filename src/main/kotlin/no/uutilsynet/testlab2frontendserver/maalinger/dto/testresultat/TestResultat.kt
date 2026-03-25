package no.uutilsynet.testlab2frontendserver.maalinger.dto.testresultat

import no.uutilsynet.testlab2frontendserver.testing.Bilde
import java.time.LocalDateTime

data class TestResultat(
    val suksesskriterium: List<String>,
    val side: String,
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
