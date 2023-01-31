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


router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.authorId = hl21users.id");
    //res.json({ rows });
    
    res.render('index.njk', {
        rows: rows,
        //user,
        //comments,
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
        title: 'Make a Post',
        users,
    });
});


router.post('/comment', async function (req, res, next) {
    const { author, post, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO hl21comments (authorId, postId, content) VALUES (?, ?, ?)", [author, post, content]);
    //alert("Det skickades (nog)");
    res.redirect('/');
});

router.get('/comment', async function (req, res, next) {
    const [users] = await promisePool.query("SELECT * FROM hl21users");
    const [posts] = await promisePool.query("SELECT * FROM hl21forum");
    res.render('comment.njk', {
        title: 'Make a Comment',
        users,
        posts,
    });
});

router.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.id=" + postId + " AND hl21forum.authorId = hl21users.id"); //Works
    const comments = await promisePool.query("SELECT hl21comments.*, hl21users.name FROM hl21comments JOIN hl21users WHERE postId=" + postId + " AND hl21comments.authorId = hl21users.id");

    res.render('post.njk', { post, comments });
});


module.exports = router;
