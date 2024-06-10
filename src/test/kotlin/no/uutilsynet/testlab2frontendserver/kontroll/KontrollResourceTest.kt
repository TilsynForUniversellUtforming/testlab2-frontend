package no.uutilsynet.testlab2frontendserver.kontroll

import com.github.javafaker.Faker
import java.net.URI
import java.time.Instant
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.web.client.RestTemplate

class KontrollResourceTest {
  private val faker = Faker()

  @Test
  fun `test at FakeTestgrunnlagAPIClient returnerer riktig data`() {
    // Mocker disse avhengighetene, siden det ikke finnes noen fakes for dem. De brukes ikke i
    // testen.
    val mockRestTemplate = Mockito.mock(RestTemplate::class.java)
    val mockTestingApiProperties = Mockito.mock(TestingApiProperties::class.java)

    val kontrollResource =
        KontrollResource(FakeTestgrunnlagAPIClient(), mockRestTemplate, mockTestingApiProperties)
    val kontrollId = faker.number().randomNumber().toInt()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = faker.lorem().sentence(),
            type = TestgrunnlagType.OPPRINNELEG_TEST,
            sideutval = emptyList(),
            testregelIdList = emptyList(),
        )
    val location = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).headers.location
    val testgrunnlagId = location?.path?.substringAfterLast("/")?.toInt()
    val testgrunnlag = kontrollResource.testgrunnlagForKontroll(kontrollId).first()
    assertThat(testgrunnlag.id).isEqualTo(testgrunnlagId)
  }
}

class FakeTestgrunnlagAPIClient : ITestgrunnlagAPIClient {
  private val faker = Faker()
  private val database = mutableMapOf<Int, KontrollResource.TestgrunnlagDTO>()

  override fun createTestgrunnlag(
      nyttTestgrunnlag: TestgrunnlagAPIClient.NyttTestgrunnlag
  ): Result<URI> {
    val id = faker.number().randomNumber().toInt()
    val testgrunnlag =
        KontrollResource.TestgrunnlagDTO(
            id = id,
            kontrollId = nyttTestgrunnlag.kontrollId,
            namn = nyttTestgrunnlag.namn,
            type = nyttTestgrunnlag.type,
            sideutval = nyttTestgrunnlag.sideutval,
            testreglar = emptyList(),
            datoOppretta = Instant.now())
    database[id] = testgrunnlag
    return Result.success(URI.create("http://localhost:8080/testgrunnlag/$id"))
  }

  override fun getTestgrunnlag(kontrollId: Int): Result<List<KontrollResource.TestgrunnlagDTO>> {
    val testgrunnlagList = database.values.filter { it.kontrollId == kontrollId }
    return Result.success(testgrunnlagList)
  }
}
