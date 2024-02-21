package no.uutilsynet.testlab2frontendserver.testreglar.dto

enum class TestregelStatus(val value: String) {
  ikkje_starta("ikkje_starta"),
  under_arbeid("under_arbeid"),
  gjennomgaatt_workshop("gjennomgaatt_workshop"),
  klar_for_testing("klar_for_testing"),
  treng_avklaring("treng_avklaring"),
  ferdig_testa("ferdig_testa"),
  klar_for_kvalitetssikring("klar_for_kvalitetssikring"),
  publisert("publisert"),
  utgaar("utgaar"),
}
