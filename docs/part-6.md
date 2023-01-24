# Del 6 - Databasdesign, relation och normalisering

- [ ] Databasedesign och normalisering

## Users dilemmat och databasnormalisering

Att spara författaren till varje post som en sträng är inte optimalt. Problemet som snabbt sker är att vi har massor med duplicerad data i databasen och det blir svårt att ändra data. Om vi vill ändra namnet på en användare så måste vi ändra det i alla inlägg som användaren har gjort.

Att spara denna data som ett textfält bryter mot en regel i något som kallas för [databasnormalisering/normalform](https://sv.wikipedia.org/wiki/Normalform_(databaser)).

Normalformen är viktig när du arbetar med databaser för det påverkar databasens prestanda och funktion. Det är ett sätt att försöka undvika fel och problem.

Att spara författare som strängar bryter mot den fösta normalformen, att spara duplicerad data. Lösningen på detta är att skapa en separat tabell för författare och spara en referens till författaren i inlägget.

## Skapa en ny tabell

```sql
CREATE TABLE DITT_ID_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

## Ändra på forum-tabellen

Lägg till en ny kolumn för att spara referensen till författaren, `authorId`.
Ta sedan bort kolumnen `author`.

```sql
ALTER TABLE DITT_ID_forum ADD COLUMN authorId INT;
ALTER TABLE DITT_ID_forum DROP COLUMN author;
```

Detta förutsätter att du har ett `id` från en användare när du skapar nya poster. Du kan sätta det till 1 så länge (en referens till den första användaren i tabellen users).

## Skapa en ny post

Eftersom du nu har en tabell för användare så behöver du skapa en användare på ett eller annat sätt innan du kan skapa ett inlägg.

```sql
INSERT INTO DITT_ID_users (name) VALUES ('Dittnamn');
```

## Skapa en ny post med referens

Sedan används denna användare för att skapa ett inlägg. Här ser du att användaren med id 1 används.

```sql
INSERT INTO DITT_ID_forum (authorId, title, content) VALUES (1, 'Hej', 'Detta är ett test');
```

## Hämta alla inlägg med författare

Med relation kan vi nu använda JOIN för att välja data från båda tabellerna.

```sql
SELECT DITT_ID_forum.*, DITT_ID_users.name FROM DITT_ID_forum
JOIN DITT_ID_users ON DITT_ID_forum.authorId = DITT_ID_users.id;
```

[Del 7](part-7.md)