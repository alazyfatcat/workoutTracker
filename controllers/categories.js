const express = require('express')
const router = express.Router()

const Category = require('../models/category')
const passport = require('passport')

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}


router.get('/add',isLoggedIn, (req, res, next) => {
    res.render('categories/add', {
        title: 'Add a Category',
        user: req.user
    })
})

router.post('/add',isLoggedIn, (req, res, next) => {
    Category.create({
        categoryCode: req.body.categoryCode
    }, (err, newExercise) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/exercises')
        }
    })
})

// make public
module.exports = router;