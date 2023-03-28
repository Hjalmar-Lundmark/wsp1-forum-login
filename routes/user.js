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
    const [rows] = await promisePool.query("SELECT * FROM hl21users");
    
    res.render('users.njk', {
        rows: rows,
        title: 'Users',
        user: req.session.user,
        loggedIn: req.session.LoggedIn,
    });
    
});

router.get('/:id', async function (req, res, next) {
    const userNr = req.params.id;
    const [user] = await promisePool.query("SELECT hl21users.id, hl21users.name, hl21users.Desc, hl21users.createdAt FROM hl21users WHERE id=?", userNr);
    
    if (user[0].id === req.session.userId) {
        return res.redirect('/profile');
    }

    res.render('user.njk', {
        users: user[0],
        title: 'User',
        user: req.session.user,
        loggedIn: req.session.LoggedIn,
    });
    
});


module.exports = router;