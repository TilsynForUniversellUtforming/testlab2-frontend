package no.uutilsynet.testlab2frontendserver.krav.dto

import org.springframework.http.ResponseEntity

interface KravApi {
    fun listKrav(): ResponseEntity<Any>
}
