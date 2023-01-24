# Del 2 - Databas

Kort SQL intro, saker du behöver förstå för att kunna arbeta med databasen.

På den här länken finns det mer att läsa om SQL, [Gitbook webbserver](https://jens-andreasson.gitbook.io/webbserverprogrammering/databas/sql).

- [ ] Skapa en databas och en tabell.
- [ ] Förstå SQL frågor, datatyper och struktur.

## SQL frågor

Använd tableplus eller mysql klienten i terminalen för att koppla upp dig / köra mot databasen.

Vill du köra lokal server, referea till det här [materialet](https://jensa.dev/posts/webbserver-programmering/), [sql](https://jensa.dev/posts/sql/).

### Skapa och använd en databas 

Om du kör på skolservern, kan du inte skapa en databas (hoppa till nästa steg). Kör du mysql lokalt måste du skapa en.

```sql
CREATE DATABASE te20;
```

Använd databasen

```sql
USE te20;
```

### Skapa tabell i databasen

Data i databasen sparas i tabeller. En databas kan innehålla ett stort antal tabeller. 

Skapa en tabell för ditt forum. Använd dig av dina initialer + dagen du är född samt forum (så du får din egen tabell på skolservern). Så för Jens blir det ja15forum. 

För att skapa en tabell så behöver du även skapa en kolumn (det som följer namnet i parenteser). Eftersom alla tabeller bör/måste/ska ha en id-kolumn är det en god ide att skapa den samtidigt som tabellen. Det går att skapa flera kolumner när tabellen skapas, men i det här fallet kommer du att lägga till dem i nästa steg.

```sql
CREATE TABLE DITT_TABELL_NAMN (id INT UNSIGNED AUTO_INCREMENT, PRIMARY KEY(id)) 
ENGINE = innodb
DEFAULT CHARSET = utf8mb4;
```

Du har nu skapat en tabell som heter `DITT_TABELL_NAMN`. I tabellen finns en kolumn som heter `id`. Den är av typen` INT UNSIGNED` (integer men bara positiva) och har `AUTO_INCREMENT` vilket betyder att den ökar med 1 för varje ny post. Den är också `PRIMARY KEY` vilket betyder att den är unik och inte kan vara samma som någon annan post.

Att skapa ett `id` med dessa egenskaper är praxis.

**Starta din server och se till att allt fungerar!**

[Del 3](part-3.md)