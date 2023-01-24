const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

//This gives a error after ~15 sec, meaning site works until 'cannot set headers after they are sent ...'

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM hl21forum");
    //res.json({ rows });
    
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    });
    
});


/*
router.get('/', async function (req, res) {
    res.send('Hello you!')
});
*/


router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO hl21forum (authorId, title, content) VALUES (?, ?, ?)", [author, title, content]);
    //alert("Det skickades (nog)");
    res.redirect('/new');
});

/* // för att man ska kunna skapa användare i formuläret, behövs ändring i html (och annat?)
router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;

    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!
    let user = await promisePool.query('SELECT * FROM hl21user WHERE name = ?', [author]);
    if (!user) {    // User eller forum ???
        user = await promisePool.query('INSERT INTO hl21user (name) VALUES (?)', [author]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren

    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO hl21forum (author, title, content) VALUES (?, ?, ?)', [userId, title, content]);
    //res.redirect('/'); // den här raden kan vara bra att kommentera ut för felsökning, du kan då använda tex. res.json({rows}) för att se vad som skickas tillbaka från databasen
});
*/

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query("SELECT * FROM hl21users");
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});


module.exports = router;
