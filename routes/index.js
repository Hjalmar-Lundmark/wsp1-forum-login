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
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    LoggedIn: false,
}));
// I should probably change this top part and in app.js a bit 

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.authorId = hl21users.id ORDER BY hl21forum.id DESC");
    //res.json({ rows });

    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    });

});

router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO hl21forum (authorId, title, content) VALUES (?, ?, ?)", [author, title, content]);
    res.redirect('/new');
});

router.get('/new', async function (req, res, next) {
    if (!req.session.LoggedIn) {
        return res.redirect('/login');
    } else {
        const [users] = await promisePool.query("SELECT hl21users.id, hl21users.name FROM hl21users");
        res.render('new.njk', {
            title: 'Make a Post',
            users,
        });
    }
});


router.post('/comment', async function (req, res, next) {
    const { author, post, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO hl21comments (authorId, postId, content) VALUES (?, ?, ?)", [author, post, content]);
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
    const [post] = await promisePool.query("SELECT hl21forum.*, hl21users.name FROM hl21forum JOIN hl21users WHERE hl21forum.id=? AND hl21forum.authorId = hl21users.id", postId); //Works
    const [comments] = await promisePool.query("SELECT hl21comments.*, hl21users.name FROM hl21comments JOIN hl21users WHERE postId=? AND hl21comments.authorId = hl21users.id", postId);

    res.render('post.njk', {
        title: 'Post ' + postId,
        post: post[0],
        comments
    });
});

router.get('/login', function (req, res, next) {
    if (req.session.LoggedIn) {
        return res.redirect('/profile');
    } else {
        res.render('form.njk', { title: 'Login ALC' });
    }
});

router.get('/profile', async function (req, res, next) {
    if (req.session.LoggedIn) {
        const [info] = await promisePool.query("SELECT hl21users.id, hl21users.name, hl21users.Desc, hl21users.createdAt FROM hl21users WHERE name=?", req.session.user);
        return res.render('profile.njk', {
            title: 'Profile',
            user: req.session.user,
            info,
        });
    } else {
        return res.status(401).send("Access denied");
    }
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    const errors = [];

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    }
    const [users] = await promisePool.query("SELECT * FROM hl21users WHERE name=?", username);
    //console.log(users)
    if (users.length > 0) {

        bcrypt.compare(password, users[0].password, function (err, result) {
            if (result) {
                req.session.user = username;
                //req.session.userId = users[0].id; //works?
                req.session.LoggedIn = true;
                return res.redirect('/profile');
            } else {
                errors.push("Invalid username or password")
                return res.json(errors)
            }
        });
    } else {
        errors.push("Wrong credentials")
        return res.json(errors)
    }
});

router.post('/delete', async function (req, res, next) {
    if (req.session.LoggedIn) {
        req.session.LoggedIn = false;
        await promisePool.query('DELETE FROM hl21users WHERE name=?', req.session.user);
        res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.post('/logout', async function (req, res, next) {
    console.log(req.session.LoggedIn);
    if (req.session.LoggedIn) {
        req.session.LoggedIn = false;
        res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.get('/register', async function (req, res) {
    if (req.session.LoggedIn) {
        return res.redirect('/profile');
    } else {
        res.render('register.njk', { title: 'Register' })
    }
});

router.post('/register', async function (req, res) {
    const { username, password, passwordConfirmation } = req.body;
    const errors = [];

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    } else if (password !== passwordConfirmation) {
        console.log("Passwords do not match")
        errors.push("Passwords do not match")
        return res.json(errors)
    }
    const [users] = await promisePool.query("SELECT * FROM hl21users WHERE name=?", username);
    //console.log(users)

    if (users.length > 0) {
        console.log("Username is already taken")
        errors.push("Username is already taken")
        return res.json(errors)
    }

    await bcrypt.hash(password, 10, async function (err, hash) {
        const [rows] = await promisePool.query('INSERT INTO hl21users (name, password) VALUES (?, ?)', [username, hash])
        res.redirect('/login');

    });
});

router.get('/crypt/:pwd', async function (req, res, next) {
    const pwd = req.params.pwd;
    await bcrypt.hash(pwd, 10, function (err, hash) {
        return res.json({ hash });
    });
});


module.exports = router;
