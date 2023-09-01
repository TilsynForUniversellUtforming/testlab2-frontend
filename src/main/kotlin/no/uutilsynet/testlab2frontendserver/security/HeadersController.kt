package no.uutilsynet.testlab2frontendserver.security

import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class HeadersController {
  @GetMapping("/testHeaders")
  fun appheaders(@RequestHeader allHeaders: Map<String, String>) {
    println("Headers " + allHeaders)

    val authentication: Authentication = SecurityContextHolder.getContext().authentication
    if (authentication !is AnonymousAuthenticationToken) {
      println("Autentication name " + authentication.getName())
      println("Credentials " + authentication.credentials)
      println("Authorities " + authentication.authorities)
      println("Principal " + authentication.principal)
    } else allHeaders.toString()
  }
}
