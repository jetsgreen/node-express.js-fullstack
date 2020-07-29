const express = require('express');
const router = express.Router();

// Bring in Article model
let Article = require('../models/articles');
let User = require('../models/user');


router.get("/add", ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
});

// Add Submit Post Rout
router.post('/add', (req, res) => {
  

    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Added')
            res.redirect('/');
        }
    })
});

// Edit single Article
router.get('/edit/:id', ensureAuthenticated,  (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
});
// Update single article
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    Article.updateOne(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated')
            res.redirect('/');
        }
    })
});

router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }

    Article.remove(query, (err) => {
        if (err) {
            console.log(err)
        }
        res.send('Success');
    })
});

// get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        User.findById(article.author, (err, user)=>{
            
            res.render('article', {
                article: article,
                author: user.name
            })
        })
       
    })
});

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
    }
  }

module.exports = router;