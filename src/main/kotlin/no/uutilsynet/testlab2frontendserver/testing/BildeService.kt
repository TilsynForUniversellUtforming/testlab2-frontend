package no.uutilsynet.testlab2frontendserver.testing

import java.net.URI
import org.springframework.stereotype.Service
import org.springframework.web.util.UriComponentsBuilder

@Service
class BildeService {

  fun proxyUrl(bilde: Bilde): Bilde {
    return bilde.copy(
        bildeURI = extreactUri(bilde.bildeURI), thumbnailURI = extreactUri(bilde.thumbnailURI))
  }

  fun extreactUri(uri: URI): URI {
    return UriComponentsBuilder.fromUriString("/api/bilder?${uri.query}").build().toUri()
  }
}
