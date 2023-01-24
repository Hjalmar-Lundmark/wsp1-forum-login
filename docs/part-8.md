# Del 8 - Författare

- [ ] Skapa en ny post i databasen med SQL INSERT
- [ ] Göra detta med Node
## Hämta alla inlägg med författare i node

Uppdatera SQL frågan i index routen. Du behöver här läsa in data från två tabeller. Du kan läsa in data från två tabeller genom att använda `JOIN` i din SQL fråga. Frågan finns i [Del 6](part-6.md).

## Posta nya inlägg med författare

Uppdatera SQL frågan i new routen.

Ett första steg är att hårdkoda det för att använda user 1.

```js
router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const [rows] = await promisePool.query('INSERT INTO DITT_TABELL_NAMN (author, title, content) VALUES (?, ?, ?)', [1, title, content]);
    res.redirect('/');
});
```

Om du ska skapa en ny författare i frågan så behöver du uppdatera så att två frågor skickas till databasen. Du kan göra detta genom att använda `promisePool.query` två gånger och lägga till data i `users` tabellen först.

`routes/index.js`
```js
router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;

    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!
    let user = await promisePool.query('SELECT * FROM din_tabell WHERE name = ?', [author]);
    if (!user) {
        user = await promisePool.query('INSERT INTO din_tabell (name) VALUES (?)', [author]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren

    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO din_tabell (author, title, content) VALUES (?, ?, ?)', [userId, title, content]);
    res.redirect('/'); // den här raden kan vara bra att kommentera ut för felsökning, du kan då använda tex. res.json({rows}) för att se vad som skickas tillbaka från databasen
});
```

Det blev en mastig bit. **Se till att du kan starta och köra din server!**

## Uppdatera formuläret

Uppdatera formuläret i new.njk så att författaren är en dropdown som läser in alla användare från databasen.

`views/new.njk`
```html
<label for="author">Författare</label>
<select name="author" id="author">
    {% for user in users %}
        <option value="{{ user.id }}">{{ user.name }}</option>
    {% endfor %}
</select>
```

Uppdatera routen för att hämta alla användare.

`routes/index.js`
```js
router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM din_tabell');
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});
```

Whew, det blev en del.

**Starta din server och se till att allt fungerar!**

[Del 9](part-9.md)