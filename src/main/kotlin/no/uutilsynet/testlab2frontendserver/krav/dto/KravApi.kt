package no.uutilsynet.testlab2frontendserver.krav.dto

interface KravApi {
  fun listKrav(): List<Krav>

  fun getKrav(id: Int): Krav
}
