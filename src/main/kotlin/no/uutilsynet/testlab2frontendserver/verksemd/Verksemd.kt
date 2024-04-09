package no.uutilsynet.testlab2frontendserver.verksemd

import java.time.Instant

data class Verksemd(
    val id: Int,
    val namn: String,
    val organisasjonsnummer: String,
    val institusjonellSektorkode: String,
    val institusjonellSektorkodeBeskrivelse: String,
    val naeringskode: String,
    val naeringskodeBeskrivelse: String,
    val organisasjonsformKode: String,
    val organsisasjonsformOmtale: String,
    val fylkesnummer: String,
    val fylke: String,
    val kommune: String,
    val kommunenummer: String,
    val postnummer: String?,
    val poststad: String?,
    val talTilsette: Int,
    val forvaltningsnivaa: String?,
    val tenesteromraade: String?,
    val aktiv: Boolean = true,
    val original: Int,
    val tidspunkt: Instant = Instant.now(),
    val underAvviking: Boolean = false
)
