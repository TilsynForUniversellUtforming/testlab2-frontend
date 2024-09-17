package no.uutilsynet.testlab2frontendserver.common

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

object TimeUtil {

  val ZONEID_OSLO = ZoneId.of("Europe/Oslo")
  fun Instant.toLocalDateTime(): LocalDateTime = LocalDateTime.ofInstant(this, ZONEID_OSLO)
}
