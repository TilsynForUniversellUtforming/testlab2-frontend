package no.uutilsynet.testlab2frontendserver.fakes

import java.net.URI
import java.time.Instant
import java.time.temporal.ChronoUnit
import no.uutilsynet.testlab2frontendserver.common.TestlabLocale
import no.uutilsynet.testlab2frontendserver.kontroll.ITestgrunnlagAPIClient
import no.uutilsynet.testlab2frontendserver.kontroll.KontrollResource
import no.uutilsynet.testlab2frontendserver.kontroll.Sideutval
import no.uutilsynet.testlab2frontendserver.kontroll.TestgrunnlagAPIClient
import no.uutilsynet.testlab2frontendserver.resultat.TestgrunnlagType
import no.uutilsynet.testlab2frontendserver.testing.Retest
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelInnholdstype
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelModus
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelStatus

object FakeTestgrunnlagAPIClient : ITestgrunnlagAPIClient {
  private val database = mutableMapOf<Int, KontrollResource.TestgrunnlagDTO>()

  override fun createTestgrunnlag(
      nyttTestgrunnlag: TestgrunnlagAPIClient.NyttTestgrunnlag
  ): Result<KontrollResource.TestgrunnlagDTO> {
    val id = fakeId()
    val testgrunnlag =
        KontrollResource.TestgrunnlagDTO(
            id = id,
            kontrollId = nyttTestgrunnlag.kontrollId,
            namn = nyttTestgrunnlag.namn,
            type = nyttTestgrunnlag.type,
            sideutval = nyttTestgrunnlag.sideutval,
            testreglar =
                nyttTestgrunnlag.testregelIdList.map {
                  TestregelDTO(
                      it,
                      "1.1.1",
                      1,
                      testgrunnlagNamne,
                      fakeId(),
                      TestregelStatus.publisert,
                      Instant.now().minus(3, ChronoUnit.DAYS),
                      TestregelInnholdstype.nett,
                      TestregelModus.manuell,
                      TestlabLocale.nb,
                      fakeId(),
                      fakeId(),
                      "1.1.1",
                      "",
                      null)
                },
            datoOppretta = Instant.now())
    database[id] = testgrunnlag
    return Result.success(testgrunnlag)
  }

  override fun createRetest(retest: Retest): Result<KontrollResource.TestgrunnlagDTO> {
    val id = fakeId()
    val testgrunnlag =
        KontrollResource.TestgrunnlagDTO(
            id = id,
            kontrollId = fakeId(),
            namn = "Kontoll 20205",
            type = TestgrunnlagType.RETEST,
            sideutval =
                listOf(
                    Sideutval(
                        retest.loeysingId, fakeId(), siteutvalNamn, URI(dummyUrl), null, fakeId())),
            testreglar =
                listOf(
                    TestregelDTO(
                        fakeId(),
                        "1.1.1",
                        1,
                        "Testregelnamn",
                        fakeId(),
                        TestregelStatus.publisert,
                        Instant.now().minus(3, ChronoUnit.DAYS),
                        TestregelInnholdstype.nett,
                        TestregelModus.manuell,
                        TestlabLocale.nb,
                        fakeId(),
                        fakeId(),
                        "1.1.1",
                        "",
                        null)),
            datoOppretta = Instant.now())
    database[id] = testgrunnlag
    return Result.success(testgrunnlag)
  }

  override fun getTestgrunnlag(kontrollId: Int): Result<List<KontrollResource.TestgrunnlagDTO>> {
    val testgrunnlagList = database.values.filter { it.kontrollId == kontrollId }
    return Result.success(testgrunnlagList)
  }

  override fun deleteTestgrunnlag(testgrunnlagId: Int): Result<Unit> {
    database.remove(testgrunnlagId)
    return Result.success(Unit)
  }
}
