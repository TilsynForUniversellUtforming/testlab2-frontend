package no.uutilsynet.testlab2frontendserver.sak

data class NettsideDTO(
    val type: String,
    val url: String,
    val beskrivelse: String,
    val begrunnelse: String
)

fun NettsideDTO.toNettsideProperties() =
    NettsideProperties(this.type, this.url, this.begrunnelse, this.beskrivelse)

fun NettsideProperties.toNettsideDTO() =
    NettsideDTO(this.type, this.url, this.description ?: "", this.reason)
