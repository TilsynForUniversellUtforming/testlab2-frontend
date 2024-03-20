package no.uutilsynet.testlab2frontendserver.testing

import java.net.URI
import java.time.Instant

data class Bilde(val id: Int, val bildeURI: URI, val thumbnailURI: URI, val opprettet: Instant)
