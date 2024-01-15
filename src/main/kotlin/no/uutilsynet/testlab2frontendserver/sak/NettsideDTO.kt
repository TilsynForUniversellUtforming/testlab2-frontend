package no.uutilsynet.testlab2frontendserver.sak

data class NettsideDTO(
    val type: String,
    val url: String,
    val beskrivelse: String,
    val begrunnelse: String,
    val id: Int?,
)

fun NettsideDTO.toNettsideProperties() =
    NettsideProperties(this.type, this.url, this.begrunnelse, this.beskrivelse, this.id)
