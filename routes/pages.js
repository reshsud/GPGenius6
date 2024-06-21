const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.get(["/","/index"],(req,res) => {
    res.render("index");
});

router.get("/register",(req,res) => {
    res.render("register");
});

router.get("/qa",(req,res) => {
    res.render("qa");
});

router.get("/info",(req,res) => {
    res.render("info");
});

router.get("/profile",userController.isLoggedIn,(req,res) => {
    if (req.user){
        res.render("profile",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

router.get("/home",userController.isLoggedIn,(req,res) => {
    if (req.user){
        res.render("home",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

module.exports = router;