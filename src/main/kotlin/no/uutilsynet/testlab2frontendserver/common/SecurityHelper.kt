package no.uutilsynet.testlab2frontendserver.common

import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.stereotype.Service

@Service
class SecurityHelper(val clientService: OAuth2AuthorizedClientService) {

  fun getAccessToken(): String {
    val authentication: Authentication = SecurityContextHolder.getContext().authentication

    val oauthToken = authentication as OAuth2AuthenticationToken

    val client: OAuth2AuthorizedClient =
        clientService.loadAuthorizedClient(
            oauthToken.getAuthorizedClientRegistrationId(), oauthToken.name)

    val accessToken = client.accessToken.tokenValue
    val refreshToken = client.refreshToken?.tokenValue

    // println("RefreshToken " + refreshToken)
    return accessToken
  }
}
