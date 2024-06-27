// Import the necessary modules
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Home1Creek2",
    database: "gpa_login",
    multipleStatements: true
});

// Renders the default page to be "index"
router.get(["/","/index"],(req,res) => {
    res.render("index");
});

//Renders register if user is in register page
router.get("/register",(req,res) => {
    res.render("register");
});

// Route to render the profile page, checks if user is logged in
router.get("/profile",userController.isLoggedIn1, (req,res) => {
    if (req.user){
        try{
            const val1 = req.user[0].EMAIL;
            console.log(val1);
            db.query('select avg(unweighted_gpa)  UWAVG, avg(weighted_gpa) WAVG from gpa_data where email=?',[val1],async(error,result9)=>{
                console.log(result9);
                //console.log(result9[0]["UWAVG"]);
                const Ucummvalues = result9[0]["UWAVG"];
                const Wcummvalues = result9[0]["WAVG"];
                res.render("profile",{user: req.user, val:req.user[0].EMAIL, avg: Ucummvalues, avg2: Wcummvalues});
            });
            
        }
        catch(error){
            console.log(error);
        }
    }

    else{
        res.redirect("/index");
    }

});

// Route to render the home page, checks if user is logged in
router.get("/home",userController.isLoggedIn1,(req,res) => {
    if (req.user){
        res.render("home",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});


router.get("/grade",userController.isLoggedIn1,(req,res) => {
    if (req.user){
        res.render("grade",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

// Route to render the verify page, checks if user is logged in
router.get("/verify",userController.isLoggedIn1,(req,res) => {
    if (req.user){
        res.render("verify",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

// Route to render the information page, checks if user is logged in
router.get("/info",userController.isLoggedIn1,(req,res) => {
    if (req.user){
        res.render("info",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

// Route to render the FAQ page, checks if user is logged in
router.get("/qa",userController.isLoggedIn1,(req,res) => {
    if (req.user){
        res.render("qa",{user: req.user});
    }
    else{
        res.redirect("/index");
    }
});

// Export the router to be used in other parts of the application
module.exports = router;