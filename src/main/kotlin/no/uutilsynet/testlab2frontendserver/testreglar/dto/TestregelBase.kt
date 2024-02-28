package no.uutilsynet.testlab2frontendserver.testreglar.dto

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav

open class TestregelBase(
    open val id: Int,
    open val namn: String,
    open val krav: Krav,
    open val modus: TestregelModus,
)

fun TestregelBaseDTO.toTestregelBase(krav: Krav) =
    TestregelBase(this.id, this.namn, krav, this.modus)
