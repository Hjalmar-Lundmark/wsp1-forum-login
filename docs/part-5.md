# Del 5

- [ ] Skapa en ny post i databasen med SQL INSERT
- [ ] Göra detta med Node och skapa formulär

## Skapa en ny post, SQL

Sql frågan för att skapa en ny post (det vill säga inserta data i en tabell) är

```sql
INSERT INTO DITT_TABELL_NAMN (author, title, content) VALUES ('Jens', 'Hej', 'Detta är ett test');
```

## Med node

För att skapa en ny post så behöver vi en ny route. Skapa en ny route i din route fil.

`routes/index.js`
```js
router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO DITT_TABELL_NAMN (author, title, content) VALUES (?, ?, ?)", [author, title, content]);
    res.redirect('/');
});
```

För att kunna hantera indata i routen så behöver vi ett express paket för att läsa det. Installera paketet `body-parser`.

```bash
npm install body-parser
```

`body-parser` är ett middleware så därför måste du lägga till det i din `app.js` för att det ska fungera. Det är även viktigt i vilken ordning du läser in middleware i din `app.js`. **Det är viktigt att du läser in `body-parser` innan du läser in din route.**

`app.js`
```js
...
const bodyParser = require('body-parser');
...
app.use(bodyParser.urlencoded({ extended: false }));
...
```

Skapa en ny template för att skriva ut formuläret. Skapa en ny fil i views.

` views/new.njk`
```html
<form action="/new" method="post">
    <label for="author">Författare</label>
    <input type="text" name="author" id="author">
    <label for="title">Titel</label>
    <input type="text" name="title" id="title">
    <label for="content">Innehåll</label>
    <textarea name="content" id="content" cols="30" rows="10"></textarea>
    <button type="submit">Skicka</button>
</form>
```

Skapa en ny route för att visa formuläret.

`routes/index.js`
```js
router.get('/new', async function (req, res, next) {
    res.render('new.njk', {
        title: 'Nytt inlägg',
    });
});
```

**Starta din server och se till att allt fungerar!**

[Del 6](part-6.md)