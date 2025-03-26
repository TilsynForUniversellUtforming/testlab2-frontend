package no.uutilsynet.testlab2frontendserver.security

import org.springframework.context.annotation.Profile
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Component

@Component
@Profile("security")
class TokenRelayInterceptor : ClientHttpRequestInterceptor {

  override fun intercept(
      request: HttpRequest,
      bytes: ByteArray,
      execution: ClientHttpRequestExecution
  ): ClientHttpResponse {
    val authentication: Authentication = SecurityContextHolder.getContext().authentication

    if (authentication is JwtAuthenticationToken) {
      request.headers.setBearerAuth(authentication.token.tokenValue)
    }
    return execution.execute(request, bytes)
  }
}
