package no.uutilsynet.testlab2frontendserver.krav.dto

interface KravApi {
  fun listKrav(): List<KravListItem>

  fun getKrav(id: Int): Krav

  fun updateKrav(id: Int, krav: Krav): Krav

  fun createKrav(krav: KravInit): Int

  fun deleteKrav(id: Int): Boolean
}
