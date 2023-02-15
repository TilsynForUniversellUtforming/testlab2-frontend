package no.uutilsynet.testlab2frontendserver.testreglar

import no.uutilsynet.testlab2frontendserver.krav.dto.Krav
import no.uutilsynet.testlab2frontendserver.testreglar.dto.Testregel
import no.uutilsynet.testlab2frontendserver.testreglar.dto.TestregelDTO
import org.springframework.stereotype.Service

@Service
class TestregelService {

  fun getTestregelList(
      testregelDTOList: List<TestregelDTO>,
      kravDTOList: List<Krav>
  ): List<Testregel> {
    val kravIdTittelMap = kravDTOList.associate { it.id to it.tittel }

    return testregelDTOList.map {
      Testregel(
          it.id,
          it.kravId,
          it.referanseAct,
          it.kravTilSamsvar,
          it.type,
          it.status,
          kravIdTittelMap[it.kravId])
    }
  }
}
