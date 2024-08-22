package no.uutilsynet.testlab2frontendserver.kontroll

import java.net.URI
import java.time.Instant
import kotlin.properties.Delegates
import no.uutilsynet.testlab2frontendserver.common.Brukar
import no.uutilsynet.testlab2frontendserver.common.TestingApiProperties
import no.uutilsynet.testlab2frontendserver.fakes.FakeTestgrunnlagAPIClient
import no.uutilsynet.testlab2frontendserver.fakes.FakeTestresultatAPIClient
import no.uutilsynet.testlab2frontendserver.fakes.fakeId
import no.uutilsynet.testlab2frontendserver.fakes.faker
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.CreateTestResultat
import no.uutilsynet.testlab2frontendserver.testing.ElementResultat
import no.uutilsynet.testlab2frontendserver.testing.ResultatManuellKontroll
import no.uutilsynet.testlab2frontendserver.testing.Retest
import no.uutilsynet.testlab2frontendserver.testing.TestResource
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.http.HttpStatus
import org.springframework.web.client.RestTemplate

class KontrollResourceTest {
  private var kontrollResource: KontrollResource by Delegates.notNull()
  private var kontrollId: Int by Delegates.notNull()
  private var testResource: TestResource by Delegates.notNull()

  @BeforeEach
  fun setUp() {
    // Mocker disse avhengighetene, siden det ikke finnes noen fakes for dem. De brukes ikke i
    // testen. Hvis de skal brukes senere, er det bedre om vi lager fakes for dem.
    val mockRestTemplate = Mockito.mock(RestTemplate::class.java)
    val mockTestingApiProperties = Mockito.mock(TestingApiProperties::class.java)

    kontrollResource =
        KontrollResource(
            FakeTestgrunnlagAPIClient,
            FakeTestresultatAPIClient,
            mockRestTemplate,
            mockTestingApiProperties)
    kontrollId = fakeId()
    testResource =
        TestResource(FakeTestresultatAPIClient, mockRestTemplate, mockTestingApiProperties)
  }

  @Test
  fun `vi kan slette et testgrunnlag, hvis den ikke er startet`() {
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = faker.lorem().sentence(),
            type = TestgrunnlagType.RETEST,
            sideutval = emptyList(),
            testregelIdList = emptyList(),
        )
    val location = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).headers.location
    val testgrunnlagId = location?.path?.substringAfterLast("/")?.toInt()!!
    val response = kontrollResource.slettTestgrunnlag(kontrollId, testgrunnlagId)

    assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)
  }

  @Test
  fun `vi får ikke lov til å slette et testgrunnlag, hvis testen har startet`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = faker.lorem().sentence(),
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId,
                        fakeId(),
                        faker.lorem().sentence(),
                        URI(faker.internet().url()),
                        null,
                        sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(faker.internet().emailAddress(), faker.name().fullName()),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)
    val testResult = testResource.createTestResultat(createTestResultat)
    testResource.updateResultatManuellKontroll(
        listOf(
            testResult.copy(
                kommentar = "Ferdig",
                elementOmtale = faker.lorem().sentence(),
                elementResultat = ElementResultat.brot,
                elementUtfall = faker.lorem().word(),
                testVartUtfoert = Instant.now(),
                status = ResultatManuellKontroll.Status.Ferdig)))

    val deleteResponse = kontrollResource.slettTestgrunnlag(kontrollId, testgrunnlagId)
    assertThat(deleteResponse.statusCode).isEqualTo(HttpStatus.FORBIDDEN)
  }

  @Test
  fun `vi kan reteste et testgrunnlag, hvis den er ferdig`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = faker.lorem().sentence(),
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId,
                        fakeId(),
                        faker.lorem().sentence(),
                        URI(faker.internet().url()),
                        null,
                        sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(faker.internet().emailAddress(), faker.name().fullName()),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)

    val testResult = testResource.createTestResultat(createTestResultat)

    testResource.updateResultatManuellKontroll(
        listOf(
            testResult.copy(
                kommentar = "Ferdig",
                elementOmtale = faker.lorem().sentence(),
                elementResultat = ElementResultat.brot,
                elementUtfall = faker.lorem().word(),
                testVartUtfoert = Instant.now(),
                status = ResultatManuellKontroll.Status.Ferdig)))

    val retestResponse =
        kontrollResource.createRetest(kontrollId, Retest(testgrunnlagId, loeysingId))

    assertThat(retestResponse.statusCode).isEqualTo(HttpStatus.OK)
  }

  @Test
  fun `vi får ikke lov til å slette et testgrunnlag, hvis ikkje alle testresultat er ferdig`() {
    val loeysingId = fakeId()
    val testregelId = fakeId()
    val sideutvalId = fakeId()
    val nyttTestgrunnlag =
        TestgrunnlagAPIClient.NyttTestgrunnlag(
            kontrollId = kontrollId,
            namn = faker.lorem().sentence(),
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        loeysingId,
                        fakeId(),
                        faker.lorem().sentence(),
                        URI(faker.internet().url()),
                        null,
                        sideutvalId)),
            testregelIdList = listOf(testregelId),
        )
    val testgrunnlag = kontrollResource.nyttTestgrunnlag(kontrollId, nyttTestgrunnlag).body
    val testgrunnlagId = testgrunnlag?.id!!

    val createTestResultat =
        CreateTestResultat(
            testgrunnlagId = testgrunnlagId,
            loeysingId = loeysingId,
            testregelId = testregelId,
            sideutvalId = sideutvalId,
            brukar = Brukar(faker.internet().emailAddress(), faker.name().fullName()),
            elementOmtale = null,
            elementResultat = null,
            elementUtfall = null,
            testVartUtfoert = null,
            kommentar = null)

    // Status ikkje starta
    testResource.createTestResultat(createTestResultat)

    val retestResponse =
        kontrollResource.createRetest(kontrollId, Retest(testgrunnlagId, loeysingId))

    assertThat(retestResponse.statusCode).isEqualTo(HttpStatus.FORBIDDEN)
  }
}
