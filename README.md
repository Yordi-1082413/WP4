# wp4 Thee


# Codebase uitleg

Deze repo bestaat uit 2 folders, /Backend en /App<br>
In /Backend is een FastAPI applicatie .main.py wordt gebruikt om de rest van de api routes te linken. 

### /Backend <br>
Als je een nieuwe route wil maken zoals bijvoorbeeld /api/login{args} maak alsjeblieft een losse
file met alleen maar login routes. <br>
Dit kan gedaan worden door een nieuwe file aan te maken<br>
deze te importen met `from routers import {jouwfilenaam}` en onderaan 
`app.include_router(jouwfilenaam.router, prefix="/api")` toe te voegen.



# Dev environment setup

De repo bestaat uit 2 verschillende applicaties, React en FastAPI deze moeten los van elkaar gerunned worden
In VSCode kan je gebruik maken van F5 debugging die meegeleverd is met deze repo hier zijn de stappen voor dev environment:

Open deze repo in VSCode en run de install script
```bash
 ./install.bat
 #./install.sh voor linux
```
Druk F5 in VSCode, dit opened 2 terminals, FastAPI en React 

Frontend kan je bereiken op: http://localhost:8081 <br>
Backend kan je bereiken op : http://localhost:8000









# Roan gedeelte:


# Mobile app

De mobile app is een moeilijke situatie om zonder te deployen te testen, de app heeft namelijk een faste backend IP, normaal kan je hier een domein achter zetten en deze naar jouw servers routen, in deze testomgeving gaat dit niet.
Daarom is in de mobiele app die gebuild is voor Android een vaste IP gebruikt, naast het gebruik maken van vaste IP's hebben we ook push notificaties, hiervoor moet je een geauthorizeerd Expo account hebben. Sinds all deze gegevens moeilijk zijn om te geven voor de oplevering met Docker raad ik het aan om zelf via expo go de app te openen in een android emulator. Om dit te doen heb je een Access token in de .env.example voor VIEW access op een dummy account, voordat ik helemaal uitgekauwt wordt (en ja ik had het liever ook via teams ofzo gestuurd maar dat is sociale interactie en daar sta ik niet voor.

Goed om locaale setup te doen moet je eerst de 2 .env.examples volgen, copieer deze naar .env en vul deze met jouw informatie.
Daarna kan je ./install.bat of ./install.sh gebruiken voor automatische installatie van VENV en Node modules (in VSCode zijn er hulp functies die installatie en startup voor jouw doen).
Om de frontend de starten cd naar /App en type 
``` bash
npm start
```
Voor backend cd naar Backend
```bash
 backend\venv\Scripts\activate.bat
 uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Als jouw frontent goed is opgstart met jouw .env kan je het openen in jouw Android emulator


# Docker Uitleg

De Dockerfile en docker-compose.yml bestaan uit 2 stages, backend en frontend. De backend stage is een Python 3.9 image met een venv en de frontend stage is een Node.js image.
Alles is automatisch gecompileerd en gecombineerd in een final image, zo gedaan om ooit nog unit tests te kunnen toevoegen.
Eerst moeten we de environment variables in de .env file instellen. om dit te doen, verander in docker-compose.yml de `environment` section naar jouw environment variables.
Voor EXPO_PUBLIC_API_URL moet je het IP van jouw computer gebruiken, dit is nodig voor mobile om te kunnen connecten.
Voor MailGun kan je een gratis Github student account gebruiken.

Om de Docker image te maken, voer de volgende commando uit:
```bash
docker compose build
```

Om de Docker image te starten, voer de volgende commando uit:
```bash
docker-compose up
```


# Docent uitleg
Login:
Username: roan
wachtwoord: roan

Als docent heb je toegang tot een losse pagina voor docenten, op deze pagina kan je studenten verwijderen, naam aanpassen of uitnodigen via email. Ook kan je ingeleverde opdrachten goed of foutkeuren, deze studenten krijgen dan een mobiele notificatie over hun opdracht. Om email berichten te stuuren is alleen een MailGun account nodig, mocht je het willen uitproberen moet je de .env.example gebruiken met jouw account gegevens. als je het niet via docker doet.

# Beheerdr uitleg

Login:
Username: test
wachtwoord: test
*stel dit werkt niet, route dan naar /beheerder om op het dashboard te komen, vanaf hier lukt het ook.

ALs beheerder heb je toegang tot een dashboard speciaal voor beheerders. Op dit dashboard heb je een compleet overzicht van totale gegevens, zoals games, vakken/ domeinen, gebruikers en docenten. Daarnaast zijn er knoppen om naar het docent dashboard te gaan en om naar het student dashboard te gaan. Er zijn ook snelkoppelingen naar de pagina om docenten in te kunnen zien en deze te kunnen bewerken en een pagina om vakken/ domeinen aan te kunnen maken of te bewerken. Daarnaast is er op een dashboard nog een activiteiten venster te zien over de recente aanmeldingen.


# Gebruiker uitleg
Login:
u: mark
p: otting

Na het inloggen kan je de keuze maken om je wachtwoord te updaten of om uit te loggen.

Rechtsboven kan je klikken op dashboard om naar het scherm te gaan waar je domeinen kan vinden, Klik op een domein en je vindt de cursussen die daarbij horen.
Na het klikken van een cursus vind je de modules die je kan voltooien.
Staat er onvoltooid? dan klik je op inleveren, kies je een bestand en lever je die in. Als je al iets hebt ingeleverd kan je dat bestand verwijderen en opnieuw kiezen door nog een keer op inleveren te drukken.
