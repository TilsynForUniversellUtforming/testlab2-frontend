package no.uutilsynet.testlab2frontendserver.verksemd
data class Verksemd(
    val id: Int,
    val namn: String,
    val organisasjonsnummer: String,
    val institusjonellSektorKode: InstitusjonellSektorKode,
    val naeringskode: Naeringskode,
    val organisasjonsform: Organisasjonsform,
    val fylke: Fylke,
    val kommune: Kommune,
    val postadresse: Postadresse?,
    val talTilsette: Int,
    val forvaltningsnivaa: String?,
    val tenesteromraade: String?,
    val underAvviking: Boolean = false
)

data class Postadresse(val postnummer: String?, val poststad: String?)

data class InstitusjonellSektorKode(val kode: String, val beskrivelse: String)

data class Naeringskode(val kode: String, val beskrivelse: String)

data class Organisasjonsform(val kode: String, val beskrivelse: String)

data class Fylke(val fylkesnummer: String, val fylke: String)

data class Kommune(val kommunenummer: String, val kommune: String)
