package no.uutilsynet.testlab2frontendserver.testreglar.dto

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale

data class TestregelDTO(
    val id: Int,
    val testregelId: String,
    val versjon: Int,
    val namn: String,
    val kravId: Int,
    val status: TestregelStatus,
    val datoSistEndra: Instant = Instant.now(),
    val type: TestregelInnholdstype,
    val modus: TestregelModus,
    val spraak: TestlabLocale,
    val tema: Int?,
    val testobjekt: Int?,
    val kravTilSamsvar: String?,
    val testregelSchema: String,
    val innhaldstypeTesting: Int?
)
