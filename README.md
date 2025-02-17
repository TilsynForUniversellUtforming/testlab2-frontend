# testlab2-frontend

GUI for testlab i ReactJS som kallar API til andre komponenter

## Utvikling

1. Start serverapplikasjon med `mvn spring-boot:run`
2. I mappa `frontend`:
    1. `npm install`
    2. `npm run dev`
3. Åpne nettleser på `http://localhost:5173/`
4. Kjør tester med `npm test` i ./frontend
5. Kjør ende-til-ende-tester med `npm run test:e2e` i ./frontend


### Bygge lokalt
Krever mulighet for å køyre bash-script
Checkout backendapplikasjoner til folder parallelt med frontend.
Oppdatert .env fil med riktig foldersti til backendapplikasjoner.
Kjør `./build.sh` i frontend-mappa.

Dette vil bygge docker-image til lokalt repository.

### Lokalt API og database

I utgangspunktet kjører frontend lokalt, men kaller API-et som kjører i testmiljøet på azure. Hvis du vil kjøre mot et
lokalt API og en lokal database, kan du kjøre opp dette systemet med compose-fila som ligger på rota i dette repoet:

`docker compose -f docker-compose.dev.yml up -d`

Eventuelt kan du lage en _run configuration_ i
IntelliJ: https://www.jetbrains.com/help/idea/docker-compose-run-configuration.html

Du må også oppdatere src/main/resources/dev.properties med disse verdiene:

```
loeysingsregister.api.url=http://localhost:8000
testing.api.url=http://localhost:8001
krav.api.url=http://localhost:8002
```

### Auth
https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html
