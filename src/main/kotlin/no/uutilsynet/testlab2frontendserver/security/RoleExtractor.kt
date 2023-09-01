package no.uutilsynet.testlab2frontendserver.security

import java.util.stream.Collectors
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority

class RoleExtractor {

  fun extractRoleFromClaims(oidcUserAuthority: OidcUserAuthority): Set<GrantedAuthority> {
    val claims = oidcUserAuthority.userInfo.getClaim<Collection<String>>("user_realm_roles")
    println("Claims $claims")

    return claims
        .stream()
        .map { role: String -> SimpleGrantedAuthority(role) }
        .collect(Collectors.toSet())
  }
}
