# Del 9 - Kommentarer

## Lägg till kommentarer

- [ ] Skapa en ny tabell för kommentarer
- [ ] Skapa en ny post
- [ ] Hämta alla kommentarer
- [ ] Förstå JOINS i SQL och hur du kan använda dem för att hämta data från flera tabeller
- [ ] Implementera kommentarer i Node

## Skapa en ny tabell för kommentarer

```sql
CREATE TABLE DITT_ID_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorId INT NOT NULL,
    postId INT NOT NULL,
    content TEXT NOT NULL
);
```

## Skapa en ny post

Detta använder post 1 och user 1. Se till att de finns i din databas.

```sql
INSERT INTO DITT_ID_comments (authorId, postId, content) VALUES (1, 1, 'Detta är en kommentar');
```

## Hämta alla kommentarer

När du hämtar kommentarer så vill du också ha med namnet på författaren. Detta gör du med en JOIN.

Du behöver även ange vilken post du vill hämta kommentarer för.

```sql
SELECT comments-tabellen.*, users-tabellen.name 
FROM comments-tabellen
JOIN users-tabellen ON comments-tabellen.authorId = users-tabellen.id 
WHERE comments-tabellen.postId = 1;
```

## Node då?

Du behöver skapa en ny route för enskilda poster som hämtar kommentarer för den posten.

Du behöver skapa ett nytt formulär och route för att kunna skapa en ny kommentar till en post.