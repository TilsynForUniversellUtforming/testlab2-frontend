package no.uutilsynet.testlab2frontendserver.testreglar.dto

enum class TestregelModus(val value: String) {
  automatisk("automatisk"),
  semiAutomatisk("semi-automatisk"),
  manuell("manuell"),
  forenklet("forenklet")
}
