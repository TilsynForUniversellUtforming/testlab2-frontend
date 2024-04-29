package no.uutilsynet.testlab2frontendserver.kontroll

data class Sideutval(
    val loeysingId: Int,
    val objektId: Int,
    val begrunnelse: String,
    val url: String,
    val egendefinertObjekt: String?
)
