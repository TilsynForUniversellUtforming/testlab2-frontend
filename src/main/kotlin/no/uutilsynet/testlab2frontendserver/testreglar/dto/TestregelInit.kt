package no.uutilsynet.testlab2frontendserver.testreglar.dto

import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale

data class TestregelInit(
    val testregelId: String,
    val versjon: Int,
    val namn: String,
    val krav: String,
    val status: TestregelStatus,
    val datoSistEndra: Instant = Instant.now(),
    val type: TestregelInnholdstype,
    val modus: TestregelModus,
    val spraak: TestlabLocale,
    val temaId: Int?,
    val testobjektId: Int?,
    val kravTilSamsvar: String?,
    val testregelSchema: String,
    val innhaldstypeTestingId: Int?
)
