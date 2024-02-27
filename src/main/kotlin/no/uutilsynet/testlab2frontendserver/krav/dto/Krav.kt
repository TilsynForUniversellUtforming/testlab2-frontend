package no.uutilsynet.testlab2frontendserver.krav.dto

data class Krav(
    val id: Int,
    val tittel: String,
    val status: String,
    val innhald: String?,
    val gjeldAutomat: Boolean,
    val gjeldNettsider: Boolean,
    val gjeldApp: Boolean,
    val urlRettleiing: String?,
    val prinsipp: String,
    val retningslinje: String,
    val suksesskriterium: String,
    val samsvarsnivaa: WcagSamsvarsnivaa
)
