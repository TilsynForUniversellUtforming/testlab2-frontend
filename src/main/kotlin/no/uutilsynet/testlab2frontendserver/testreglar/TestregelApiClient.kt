package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.common.RestHelper.getList
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.testreglar.dto.InnhaldstypeTesting
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Tema
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testobjekt
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

@Component
class TestregelApiClient(val restTemplate: RestTemplate,  testingApiProperties: TestingApiProperties) {

    val testregelUrl = "${testingApiProperties.url}/v1/testreglar"

    fun getInnhaldstypeForTestingList() =
        restTemplate.getList<InnhaldstypeTesting>("$testregelUrl/innhaldstypeForTesting")

    fun getTemaForTestreglar() = restTemplate.getList<Tema>("$testregelUrl/temaForTestreglar")

    fun getTestobjektForTesting() = restTemplate.getList<Testobjekt>("$testregelUrl/testobjektForTestreglar")

    fun getTestregelListWithMetadata() = restTemplate.getList<TestregelDTO>("$testregelUrl?includeMetadata=true")


}