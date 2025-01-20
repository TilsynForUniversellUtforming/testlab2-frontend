package no.uutilsynet.testlab2frontendserver.krav.dto

data class KravListItem(
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
    val samsvarsnivaa: String,
    val kommentarBrudd: String?
) {

  constructor(
      krav: Krav
  ) : this(
      id = krav.id,
      tittel = krav.tittel,
      status = krav.status.status,
      innhald = krav.innhald,
      gjeldAutomat = krav.gjeldAutomat,
      gjeldNettsider = krav.gjeldNettsider,
      gjeldApp = krav.gjeldApp,
      urlRettleiing = krav.urlRettleiing,
      prinsipp = krav.prinsipp.prinsipp,
      retningslinje = krav.retningslinje.retninglinje,
      suksesskriterium = krav.suksesskriterium,
      samsvarsnivaa = krav.samsvarsnivaa.toString(),
      kommentarBrudd = krav.kommentarBrudd)
}
