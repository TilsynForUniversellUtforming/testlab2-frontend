package no.uutilsynet.testlab2frontendserver.testreglar.dto

data class Regelsett(val id: Int, val namn: String, val testregelList: List<TestregelDTO>)
