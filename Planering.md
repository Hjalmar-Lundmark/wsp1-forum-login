# Planering

## Att göra lista
- &#9745; Se till att login, register, etc fungerar. 
- &#9744; Kolla igenom koden och förbättra vissa delar.
- &#9745; Ändra post och comment forms.
- &#9745; Hantera errors bättre. 
- &#9745; Js i navigation för att ta bort 'login' knapp när man är inloggad och ta bort 'create post' knapp när användare inte är inloggad, med mera. 
- &#9745; User-info i db
- &#9744; Update-func för user-bio
- &#9744; Delete-func för comments&posts

Vad ska jag göra med den nuvarande 'user page' som suger? 
Vad ska hända med posts om användaren tar bort sitt konto?


## Loggbok
14/3: Draw.io, skapade repo, började fixa kod. 

17/3: Fick login, register och det att fungera, la till `createdAt` och `description` för users i db, ändrade i njk enligt de additionerna. 

21/3: &#9745;Jag ska fixa post och comment till att man måste vara inloggad. 

Denna lektion har jag: Ändrat i navbar för att vissa olika saker om användaren är inloggad eller inte. Sett till att användare måste vara inloggade för att posta eller kommentera. Många små ändringar. Flyttade `create comment` till under posts. 

Nästa lektion: SASS, gör klar comment, 

24/3: Förra lektionen fixade jag att navbaren vissar bara relevanta knappar för när användaren är inloggad eller inte och jag flyttade också kommentar funktion. Nu idag ska jag göra lite SASS för att de ska se bättre ut, lägga till tvättning av data och jobba med errorhantering. Tror inte det blir något problem eller hinder. 

Denna lektion har jag ändrat i SASS för att få knappar och vissa andra saker att se bättre ut, jag har förbättrat error-feedback användaren får från fel i att skapa post, etc. Jag har också skaffat ett npm paket för att tvätta data som åker in i databasen och byggt lite kod för att det ska fungera. 