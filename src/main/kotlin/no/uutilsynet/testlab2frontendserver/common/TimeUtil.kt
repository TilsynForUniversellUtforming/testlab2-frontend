package no.uutilsynet.testlab2frontendserver.common

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

object TimeUtil {
  fun Instant.toLocalDateTime(): LocalDateTime =
      LocalDateTime.ofInstant(this, ZoneId.of("Europe/Oslo"))
}
