package no.uutilsynet.testlab2frontendserver.maalinger.dto

import java.time.LocalDate

data class TestKoeyringDTO(
    val tilstand: JobStatus,
    val loeysing: Loeysing,
    val sistOppdatert: LocalDate,
    val framgang: Framgang?,
    val crawlResultat: CrawlResultatDTO
)
