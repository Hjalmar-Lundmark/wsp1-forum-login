require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var cookieParser = require('cookie-parser')
/*app.use(cookieParser())
app.set('trust proxy', 1)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true, 
    cookie: {sameSite: false, secure: false, httpOnly: false,},
  })
)*/

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

app.use(express.static('public'))


nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

var session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  //LoggedIn: false,  // when removed keeps the user logged in even after restarting the page
}));