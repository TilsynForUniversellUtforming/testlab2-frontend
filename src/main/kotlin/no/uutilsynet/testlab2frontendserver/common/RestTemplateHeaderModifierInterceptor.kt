package no.uutilsynet.testlab2frontendserver.common

import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.stereotype.Service

@Service
class RestTemplateHeaderModifierInterceptor(val clientService: OAuth2AuthorizedClientService) :
    ClientHttpRequestInterceptor {

  override fun intercept(
      request: HttpRequest,
      body: ByteArray,
      execution: ClientHttpRequestExecution
  ): ClientHttpResponse {
    val authentication: Authentication = SecurityContextHolder.getContext().authentication
    if (authentication.isAuthenticated && authentication is OAuth2AuthenticationToken) {
      val client: OAuth2AuthorizedClient =
          clientService.loadAuthorizedClient(
              authentication.getAuthorizedClientRegistrationId(), authentication.name)
      val accessToken = client.accessToken.tokenValue
      request.headers.set("Authorization", "Bearer " + accessToken)
      println("AccessToken " + accessToken + "request " + request.uri)
      return execution.execute(request, body)
    } else {
      return execution.execute(request, body)
    }
  }
}
