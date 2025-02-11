package no.uutilsynet.testlab2frontendserver.testing

import java.net.URI
import org.springframework.stereotype.Service

@Service
class BildeService {

  fun proxyUrl(bilde: Bilde): Bilde {
    return bilde.copy(
        bildeURI = extreactUri(bilde.bildeURI), thumbnailURI = extreactUri(bilde.thumbnailURI))
  }

  fun extreactUri(uri: URI): URI {
    val uriParts = uri.toString().split("/")
    val imageName = uriParts.takeLast(1).joinToString { it }

    return URI("/api/bilder/$imageName")
  }
}
