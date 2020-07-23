const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
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

// Set up the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')))

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

// get single article
app.get('/article/:id', (req, res)=>{
    Article.findById(req.params.id, (error, article)=>{
        res.render('article', {
            article:article
        })
    })
});

app.get("/articles/add", (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
});

// Add Submit Post Rout
app.post('/articles/add', (req, res)=>{
 let article = new Article();
 article.title = req.body.title;
 article.author = req.body.author;
 article.body = req.body.body;

 article.save((err)=>{
     if(err){
        console.log(err);
        return;
     }else{
         res.redirect('/');
     }
 })
});

// Edit single Article
app.get('/article/edit/:id', (req, res)=>{
    Article.findById(req.params.id, (error, article)=>{
        res.render('edit_article', {
            title: 'Edit Article',
            article:article
        })
    })
});
// Update single article
app.post('/articles/edit/:id', (req, res)=>{
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
   
    Article.update(query, article, (err)=>{
        if(err){
           console.log(err);
           return;
        }else{
            res.redirect('/');
        }
    })
   });

 app.delete('/article/:id', (req, res)=>{
    let query = {_id:req.params.id}

    Article.remove(query, (err)=>{
        if(err){
            console.log(err)
        }
        res.send('Success');
    })
 })  

const PORT = 1000;

// Start Server
app.listen(1000, () => {
    console.log(`Server listening on port: ${PORT}`)
})
