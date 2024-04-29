package no.uutilsynet.testlab2frontendserver.verksemd

import java.time.Instant

data class Verksemd(
    val id: Int,
    val namn: String,
    val organisasjonsnummer: String,
    val institusjonellSektorKode: InstitusjonellSektorKode,
    val naeringskode: Nearingskode,
    val organisasjonsform: Organisasjonsform,
    val fylke: Fylke,
    val kommune: Kommune,
    val postadresse: Postadresse?,
    val talTilsette: Int,
    val forvaltningsnivaa: String?,
    val tenesteromraade: String?,
    val aktiv: Boolean = true,
    val original: Int,
    val tidspunkt: Instant = Instant.now(),
    val underAvviking: Boolean = false
)

data class Postadresse(val poststad: String?, val postnummer: String?)

data class InstitusjonellSektorKode(val kode: String, val beskrivelse: String)

data class Nearingskode(val kode: String, val beskrivelse: String)

data class Organisasjonsform(val kode: String, val omtale: String)

data class Fylke(val fylkesnummer: String, val fylke: String)

data class Kommune(val kommunenummer: String, val kommune: String)
