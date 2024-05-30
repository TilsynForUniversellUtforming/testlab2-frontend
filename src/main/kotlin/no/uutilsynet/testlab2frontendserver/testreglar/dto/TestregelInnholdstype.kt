package no.uutilsynet.testlab2frontendserver.testreglar.dto

enum class TestregelInnholdstype(val value: String) {
  app("app"),
  automat("automat"),
  dokument("dokument"),
  nett("nett"),
}

enum class RegelsettInnholdstype(val value: String) {
  app(TestregelInnholdstype.app.value),
  automat(TestregelInnholdstype.automat.value),
  dokument(TestregelInnholdstype.dokument.value),
  nett(TestregelInnholdstype.nett.value),
  kombinasjon("kombinasjon")
}
