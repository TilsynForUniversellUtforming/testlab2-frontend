package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.time.LocalDate

data class TestKoeyring(
    val tilstand: JobStatus,
    val loeysing: Loeysing,
    val sistOppdatert: LocalDate,
    val framgang: Framgang?
)
