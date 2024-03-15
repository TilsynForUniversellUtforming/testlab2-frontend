package no.uutilsynet.testlab2frontendserver.common

import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository
import org.springframework.stereotype.Component

@Component("OAuth2AuthorizedClientManager")
class AuthorizedClientManager(
    clientRegistrationRepository: ClientRegistrationRepository,
    authorizedClientRepository: OAuth2AuthorizedClientRepository
) : OAuth2AuthorizedClientManager {

  lateinit var authorizedClientManager: DefaultOAuth2AuthorizedClientManager

  init {
    authorizedClientManager =
        DefaultOAuth2AuthorizedClientManager(
            clientRegistrationRepository, authorizedClientRepository)
    val authorizedClientProvider =
        OAuth2AuthorizedClientProviderBuilder.builder().authorizationCode().refreshToken().build()
    authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider)
  }

  override fun authorize(authorizeRequest: OAuth2AuthorizeRequest?): OAuth2AuthorizedClient? {
    return authorizedClientManager.authorize(authorizeRequest)
  }
}
