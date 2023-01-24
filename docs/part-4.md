# Del 4 - Arbeta mot databasen med Node

Nu är det dags att koppla upp sig mot databasen från node. För att göra detta så behöver vi en databasklient. Det här exemplet kommer använda sig av [mysql2](https://www.npmjs.com/package/mysql2).

- [ ] Node och MySQL2
- [ ] Dotenv och skydda känsliga uppgifter
- [ ] Hämta data från databasen och visa den

## Logga in på databasen

För att komma åt databasinställningarna user/pass så kommer du att använda dotenv. Detta är för att skydda uppgifterna från att hamna på GitHub. Det är viktigt att du inte lägger upp känsliga uppgifter på GitHub. Det är en vanlig misstag som kan leda till att dina uppgifter hamnar i fel händer.

Du behöver paketet [dotenv](https://www.npmjs.com/package/dotenv). Kör `npm i` för att installera det.

 Skapa en .env fil i projektets root och lägg in dina inställningar där.

```bash
touch .env
```

`.env`
```
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_HOST=
```

Läs in filen i din `app.js`, gör detta överst i filen. När du redigerat `.env` måste du starta om servern för att ändringarna ska träda i kraft.

`app.js`
```js
require('dotenv').config();
```

Vanligt är att göra en kopia av `.env` filen, `.env-example` som inte innehåller några känsliga uppgifter. Denna fil kan du lägga upp på GitHub. Detta så att det inte behöver vara ett mysterium vilka uppgifter din app kräver för att kunna köras.

## Uppkoppling

Nu är du redo för att koppla upp dig mot databasen.

Vi kan göra detta i index routen för att testa / exempel.

`routes/index.js`
```js
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();
```

## Data

Hämta sedan alla rader. Skicka till klienten som json.
Att hämta data från databasen är en asynkron process. Detta innebär att du måste använda dig av await eller .then() för att få tillbaka data. och funktionen måste vara async.

`routes/index.js`
```js
router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM ja15forum");
    res.json({ rows });
});
```

Den data som hämtas från databasen är en array med objekt. Varje objekt är en rad i tabellen.
Den data som hämtas från databasen kan du sedan använda i en template för att skriva ut datan med html.

`res.render` använder `res`, response objektet i en route. Det måste alltså skrivas innuti en route. Du kan inte heller använda dig av flera `res.***` i samma route då varje `res` försöker skicka ett response till klienten, det blir då fel.

`routes/index.js`
```js
...
res.render('index.njk', {
    rows: rows,
    title: 'Forum',
});
...
```

Uppdatera sedan din nunjucks template.

`views/index.njk`
```html
<ul>
    {% for row in rows %}
        <li>
            {{ row | dump }}
        </li>
    {% endfor %}
</ul>
```

**Starta din server och se till att allt fungerar!**

[Del 5](part-5.md)