package no.uutilsynet.testlab2frontendserver.fakes

import java.util.Random

fun fakeId(): Int {
  val rand = Random()
  return rand.nextInt()
}

const val brukarNamn = "Brukarnamn"
const val emailAddress = "brukar@example.com"
const val dummyUrl = "https://www.example.com"

const val testgrunnlagNamne = "Nytt testgrunnlag"

const val siteutvalNamn = "Testing av side"

const val elementOmtale = "Eit testelement"

const val elementUtfall = "Eit utfall"
