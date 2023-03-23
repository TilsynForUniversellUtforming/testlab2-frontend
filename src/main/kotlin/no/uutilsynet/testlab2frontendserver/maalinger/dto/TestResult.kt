package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.net.URL
import java.time.LocalDate

data class TestResult(
    val tilstand: JobStatus,
    val loeysing: Loeysing,
    val sistOppdatert: LocalDate,
    val statusURL: URL,
)
