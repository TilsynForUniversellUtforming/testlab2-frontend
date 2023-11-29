package no.uutilsynet.testlab2frontendserver.regelsett.dto

import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelType

open class RegelsettBase(
    open val id: Int,
    open val namn: String,
    open val type: TestregelType,
    open val standard: Boolean,
)
