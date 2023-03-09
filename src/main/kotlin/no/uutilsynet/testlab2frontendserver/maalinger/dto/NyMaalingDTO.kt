package no.uutilsynet.testlab2frontendserver.maalinger.dto

data class NyMaalingDTO(val navn: String, val loeysingIdList: List<Int>)

fun MaalingInit.toNyMaalingDTO(): NyMaalingDTO =
    NyMaalingDTO(navn = this.navn, loeysingIdList = this.loeysingList.map { it.id })
