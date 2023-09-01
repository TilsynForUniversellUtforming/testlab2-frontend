package no.uutilsynet.testlab2frontendserver.security

import org.junit.jupiter.api.Test
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.OidcUserInfo
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority

class SecurityConfigTest {

  @Test
  fun extractUserInfoClaims() {

    val idToken =
        OidcIdToken.withTokenValue("Testtoken")
            .claim("scope", arrayListOf("profile", "oidc"))
            .build()

    val userInfo: OidcUserInfo =
        OidcUserInfo.builder().claim("user_realm_roles", arrayListOf("brukar editor")).build()

    val userAuthority: OidcUserAuthority = OidcUserAuthority(idToken, userInfo)

    val roleExtractor = RoleExtractor()
    val authorities: Collection<GrantedAuthority> =
        roleExtractor.extractRoleFromClaims(userAuthority)
    val roles: Collection<String> = authorities.stream().map { it -> it.authority }.toList()

    roles.contains("brukar editor")
  }
}
