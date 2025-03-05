package no.uutilsynet.testlab2frontendserver.krav.dto

import java.net.URL
import no.uutilsynet.testlab2.constants.KravStatus
import no.uutilsynet.testlab2.constants.WcagPrinsipp
import no.uutilsynet.testlab2.constants.WcagRetninglinje
import no.uutilsynet.testlab2.constants.WcagSamsvarsnivaa

data class Krav(
    val id: Int,
    val tittel: String,
    val status: KravStatus,
    val innhald: String?,
    val gjeldAutomat: Boolean = false,
    val gjeldNettsider: Boolean = false,
    val gjeldApp: Boolean = false,
    val urlRettleiing: String?,
    val prinsipp: WcagPrinsipp,
    val retningslinje: WcagRetninglinje,
    val suksesskriterium: String,
    val samsvarsnivaa: WcagSamsvarsnivaa,
    val kommentarBrudd: String?,
)

data class KravInit(
    val tittel: String,
    val status: KravStatus,
    val innhald: String?,
    val gjeldAutomat: Boolean = false,
    val gjeldNettsider: Boolean = false,
    val gjeldApp: Boolean = false,
    val urlRettleiing: URL?,
    val prinsipp: WcagPrinsipp?,
    val retningslinje: WcagRetninglinje?,
    val suksesskriterium: String,
    val samsvarsnivaa: WcagSamsvarsnivaa?,
    val kommentarBrudd: String?
)
