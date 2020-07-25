const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User model
let User = require('../models/user');

// Register Form

router.get('/register', (req, res) => {
    res.render('register');
});


// Register Users
router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
           if(err){
               console.log(err)
           } 
           newUser.password = hash;
           newUser.save((err)=>{
            if(err){
                console.log(err);
                return;
            }else{
              req.flash('success', 'You are now registered and can log in');
              res.redirect('/users/login');
            }
           })
        });
    });
});

// Login Form
router.get('/login', (req, res) => {
    res.render('login')
});

// Login Process
router.post('/login',(req, res, next)=> {
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get('/logout', (req, res, next)=>{
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router