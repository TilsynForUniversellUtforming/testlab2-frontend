package no.uutilsynet.testlab2frontendserver.fakes

import com.github.javafaker.Faker

val faker = Faker()

fun fakeId(): Int = faker.number().randomNumber().toInt()
