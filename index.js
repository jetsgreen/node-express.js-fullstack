const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash')
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/nodeExpress');
let db = mongoose.connection;

// check connection
db.once('open', () => {
    console.log('Connected to MongoDb')
})

// check for db erros
db.on('error', (err) => {
    console.log(Error)
});

// Init App
const app = express();

// Bring in models
let Article = require('./models/articles');
let User = require('./models/user')

// Set up the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



app.get("/", (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        };

    });

});

// Route files
let articles = require('./routes/articles.js') ;
let users = require('./routes/users.js') ;
app.use('/articles', articles);
app.use('/users', users);


const PORT = 1000;

// Start Server
app.listen(1000, () => {
    console.log(`Server listening on port: ${PORT}`)
})
