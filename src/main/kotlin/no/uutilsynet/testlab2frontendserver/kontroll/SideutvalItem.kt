package no.uutilsynet.testlab2frontendserver.kontroll

import java.net.URI

data class SideutvalItem(
    val loeysingId: Int,
    val objektId: Int,
    val begrunnelse: String,
    val url: URI,
    val egendefinertObjekt: String?
)
