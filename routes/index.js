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
const bcrypt = require('bcrypt');
var session = require('express-session');
const { response } = require('express');
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    LoggedIn: false,
}));
var validator = require('validator');
let responseErr = {
}

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.authorId = hl21users.id ORDER BY hl21forum.id DESC");

    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
        user: req.session.user,
        loggedIn: req.session.LoggedIn,
    });
});

router.get('/nav', async function (req, res, next) {
    res.render('nav.njk', {
        user: req.session.user,
        loggedIn: req.session.LoggedIn,
    })
})

router.post('/new', async function (req, res, next) {
    const { title, content } = req.body;
    responseErr = {
        err: [],
    }

    if (!title) {
        responseErr.err.push('Post needs a title');
    }
    if (!content) {
        responseErr.err.push('Post needs content');
    }
    if (title.length < 4) {
        responseErr.err.push('Title needs atlest 4 characters');
    }

    if (responseErr.err.length === 0) {
        //sanitize
        const sanitize = (str) => {
            let temp = str.trim();
            temp = validator.stripLow(temp);
            temp = validator.escape(temp);
            return temp;
        };
        if (title) sanitizedTitle = sanitize(title);
        if (content) sanitizedBody = sanitize(content);


        const [rows] = await promisePool.query("INSERT INTO hl21forum (authorId, title, content) VALUES (?, ?, ?)",
            [req.session.userId, sanitizedTitle, sanitizedBody]);
        res.redirect('/post/' + rows.insertId + '');
    } else {
        //res.json(responseErr.err);
        res.redirect('/new');
    }
});

router.get('/new', async function (req, res, next) {
    if (!req.session.LoggedIn) {
        return res.redirect('/login');
    } else {
        res.render('new.njk', {
            title: 'Make a Post',
            user: req.session.user,
            loggedIn: req.session.LoggedIn,
            error: responseErr,
        });
    }
});


router.post('/comment', async function (req, res, next) {
    const { post, content } = req.body;
    responseErr = {
        err: [],
    }

    if (!content) {
        responseErr.err.push('Comment needs content');
    }

    if (responseErr.err.length === 0) {
        //sanitize
        const sanitize = (str) => {
            let temp = str.trim();
            temp = validator.stripLow(temp);
            temp = validator.escape(temp);
            return temp;
        };
        if (content) sanitizedBody = sanitize(content);


        const [rows] = await promisePool.query("INSERT INTO hl21comments (authorId, postId, content) VALUES (?, ?, ?)",
            [req.session.userId, post, sanitizedBody]);
        res.redirect('/post/' + post + '');
    } else {
        res.redirect('/post/' + post + '');
    }
});

router.get('/comment', async function (req, res, next) {
    if (!req.session.LoggedIn) {
        return res.redirect('/login');
    } else {
        const [posts] = await promisePool.query("SELECT * FROM hl21forum");
        res.render('comment.njk', {
            title: 'Make a Comment',
            posts,
            user: req.session.user,
            loggedIn: req.session.LoggedIn,
        });
    }
});

router.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    const [post] = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.id=? AND hl21forum.authorId = hl21users.id", postId); //Works
    const [comments] = await promisePool.query("SELECT hl21comments.*, hl21users.name FROM hl21comments JOIN hl21users WHERE postId=? AND hl21comments.authorId = hl21users.id", postId);

    res.render('post.njk', {
        title: 'Post ' + postId,
        post: post[0],
        comments,
        loggedIn: req.session.LoggedIn,
        user: req.session.user,
        error: responseErr,
    });
});

router.get('/login', function (req, res, next) {
    if (req.session.LoggedIn) {
        return res.redirect('/profile');
    } else {
        res.render('form.njk', {
            title: 'Login',
            error: responseErr,
        });
    }
});

router.get('/profile', async function (req, res, next) {
    if (req.session.LoggedIn) {
        const [info] = await promisePool.query("SELECT hl21users.id, hl21users.name, hl21users.Desc, hl21users.createdAt FROM hl21users WHERE name=?", req.session.user);
        return res.render('profile.njk', {
            title: 'Profile',
            user: req.session.user,
            info,
            loggedIn: req.session.LoggedIn,
        });
    } else {
        return res.status(401).send("Access denied"); //TODO: fix 
    }
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    responseErr = {
        err: [],
    }
    if (username === "") {
        responseErr.err.push('Username is required');
    }
    if (password === "") {
        responseErr.err.push('Password is required');
    }
    if (responseErr.err.length === 0) { // I feel like this is a bit too much spagetti
        const [users] = await promisePool.query("SELECT * FROM hl21users WHERE name=?", username);
        if (users.length > 0) {
            bcrypt.compare(password, users[0].password, function (err, result) {
                if (result) {
                    req.session.user = username;
                    req.session.userId = users[0].id;
                    req.session.LoggedIn = true;
                    return res.redirect('/profile');
                } else {
                    responseErr.err.push('Invalid username or password');
                    res.redirect('/login');
                }
            });
        } else {
            responseErr.err.push('Wrong credentials');
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/delete', async function (req, res, next) {
    if (req.session.LoggedIn) {
        req.session.LoggedIn = false;
        await promisePool.query('DELETE FROM hl21users WHERE name=?', req.session.user);
        res.redirect('/register');
    } else {
        return res.status(401).send("Access denied"); //TODO
    }
});

router.post('/logout', async function (req, res, next) {
    if (req.session.LoggedIn) {
        req.session.LoggedIn = false;
        res.redirect('/login');
    } else {
        return res.status(401).send("Access denied"); //TODO
    }
});

router.get('/register', async function (req, res) {
    if (req.session.LoggedIn) {
        return res.redirect('/profile');
    } else {
        res.render('register.njk', { 
            title: 'Register',
            error: responseErr, 
        })
    }
});

router.post('/register', async function (req, res) {
    const { username, password, passwordConfirmation } = req.body;
    responseErr = {
        err: [],
    }

    if (username === "") {
        responseErr.err.push('Username is required');
    }
    if (password === "") {
        responseErr.err.push('Password is required');
    }
    if (password !== passwordConfirmation) {
        responseErr.err.push('Passwords need to match');
    }
    
    if (responseErr.err.length === 0) {
        const [testing] = await promisePool.query("SELECT * FROM hl21users WHERE name=?", username);

        if (testing.length > 0) {
            responseErr.err.push('Username is already taken');
            return res.redirect('/register');
        }

        await bcrypt.hash(password, 10, async function (err, hash) {
            const [rows] = await promisePool.query('INSERT INTO hl21users (name, password) VALUES (?, ?)', [username, hash])
            req.session.user = username;
            const [users] = await promisePool.query("SELECT * FROM hl21users WHERE name=?", username);
            req.session.userId = users[0].id;
            req.session.LoggedIn = true;
            return res.redirect('/profile');
        });
    } else {
        res.redirect('/register');
    }
});

router.get('/crypt/:pwd', async function (req, res, next) {
    const pwd = req.params.pwd;
    await bcrypt.hash(pwd, 10, function (err, hash) {
        return res.json({ hash });
    });
});


module.exports = router;
