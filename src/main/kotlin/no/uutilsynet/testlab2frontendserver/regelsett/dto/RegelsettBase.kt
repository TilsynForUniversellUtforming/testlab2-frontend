package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus

open class RegelsettBase(
    open val id: Int,
    open val namn: String,
    open val modus: TestregelModus,
    open val standard: Boolean,
)
