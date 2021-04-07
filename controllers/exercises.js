// require express and enable express routing
const express = require('express')
const router = express.Router()

const Exercise = require('../models/exercise')
const Category = require('../models/category')
const passport = require('passport')

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
router.get('/', (req, res, next) => {
    Exercise.find((err, exercises)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('exercises/index', {
                title: 'My Exercises',
                exercises: exercises,
                user: req.user
            })
        }
    })
})

router.get('/add', isLoggedIn, (req, res, next) => {
    Category.find((err, categories) => {
        if(err){
            console.log(err)
        }
        else{
            res.render('exercises/add', { 
                title: 'Exercises Details',
                categories: categories,
                user: req.user
            })
        }
    }).sort({categoryCode: 1})
})

router.post('/add', isLoggedIn, (req, res, next)=>{
    Exercise.create({
        name: req.body.name,
        dueDate: req.body.dueDate,
        category: req.body.category,
        length: req.body.length,
        description: req.body.description
    }, (err, newExercise) => {
         if(err){
             console.log(err)
         }
         else{
             res.redirect('/exercises')
         }
    })
})

router.get('/delete/:_id', isLoggedIn, (req,res,next)=>{
    Exercise.remove({ _id: req.params._id}, (err)=>{
        if (err){
            console.log(err)
        }
        else{
            res.redirect('/exercises')
        }
    })
})

router.get('/edit/:_id', isLoggedIn, (req,res,next)=>{
    Exercise.findById(req.params._id, (err, exercise)=>{
        if (err){
            console.log(err)
        }
        else{
            Category.find((err, categories)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.render('exercises/edit',{
                        title: 'Exercises Details',
                        exercise: exercise,
                        categories: categories,
                        user: req.user
                    })
                }
            }).sort({ categoryCode: 1 })
        }
    })
})

router.post('/edit/:_id', (req, res, next)=>{
    Exercise.findOneAndUpdate({ _id: req.params._id}, {
        name: req.body.name,
        dueDate: req.body.dueDate,
        category: req.body.category,
        description: req.body.description,
        length: req.body.length
    }, (err, exercise) => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/exercises')
        }
    })
})

module.exports = router;

