# Planering

## Forum
Mitt forum börjar med ett flöde av posts, en navbar som innehåller knappar till att logga in och registrera konto; och en footer för copyright och link till repot på github. Posterna kna man gå in på och se kommentarer vare sig man är inloggad eller inte, men om man har loggat in så kan man skapa en kommentar där. Alla posts har en skapare, vilket genom att klicka på det namnet kan man ta sig till dens profil. Användaren loggar in eller skapar konto genom att klicka på den respektiva linken där man skriver in användarnamn, lösenord, etc och blir inloggad om allt stämmer. När användaren är inloggad så förändras linkarna i navbaren till att innehålla knapp till att skapa en egen post, gå till sin profil och logga-ut. I profilen kan användaren se och ändra sin bio/deskription, logga ut eller ta bort sitt konto. Användaren kan skapa en post genom att vara inloggad, gå till skapa-post sidan och fylla i fälten. 

Att ta bort post eller kommentar jobbas hårt på och kommer definitivt komma i en framtida uppdatering. 

Stilmässigt tänker jag mig en mörk färg för bakgrund och en ljus färg för inuti posts så de står ut från bakgrunden. Footern vill jag ha svart med vit text för det passar bra. Navbaren kommer vara en passande färg. 

## Att göra lista
- &#9745; Se till att login, register, etc fungerar. 
- &#9744; Kolla igenom koden och förbättra vissa delar.
- &#9745; Ändra post och comment forms.
- &#9745; Hantera errors bättre. 
- &#9745; Js i navigation för att ta bort 'login' knapp när man är inloggad och ta bort 'create post' knapp när användare inte är inloggad, med mera. 
- &#9745; User-info i db
- &#9745; Update-func för user-bio
- &#9744; Delete-func för comments&posts

Vad ska jag göra med den nuvarande 'user page' som suger? 
Vad ska hända med posts om användaren tar bort sitt konto?


## Loggbok
14/3: Draw.io, skapade repo, började fixa kod. 

17/3: Fick login, register och det att fungera, la till `createdAt` och `description` för users i db, ändrade i njk enligt de additionerna. 

21/3: &#9745;Jag ska fixa post och comment till att man måste vara inloggad. 

Denna lektion har jag: Ändrat i navbar för att vissa olika saker om användaren är inloggad eller inte. Sett till att användare måste vara inloggade för att posta eller kommentera. Många små ändringar. Flyttade `create comment` till under posts. 

Nästa lektion: SASS, gör klar comment, 

24/3: Förra lektionen fixade jag att navbaren visar bara relevanta knappar för när användaren är inloggad eller inte och jag flyttade också kommentar funktion. Nu idag ska jag göra lite SASS för att de ska se bättre ut, lägga till tvättning av data och jobba med errorhantering. Tror inte det blir något problem eller hinder. 

Denna lektion har jag ändrat i SASS för att få knappar och vissa andra saker att se bättre ut, jag har förbättrat error-feedback användaren får från fel i att skapa post, etc. Jag har också skaffat ett npm paket för att tvätta data som åker in i databasen och byggt lite kod för att det ska fungera. 

28/3: Förra lektionen lade jag till mer säkerhet och tvättning av data. Jag förbättrade error-hanteringen och ändrade i sass. Idag ska jag bland annat försöka fixa en bug med error-hanteringen, formatera upp min route fil så den är lättare att läsa och lägga till en funktion/sida för att ändra sin profils bio. Borde inte vara några större problem. 

Idag har jag fixat en bugg från error-hanteringen, laggt till en sida och funktion för att redigera sin profils bio. Jag har också formatterat och flyttat runt i min primära route-fil för att göra det lättare att läsa och hitta det man behöver. Nästa lektion ska jag bland annat fixa en bug i update för bio. 