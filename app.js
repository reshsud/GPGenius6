/* This file contains the logic and functionality of the program*/
//PACKAGES USED: express, mysql2, dotenv, hbs, cookie-parser, body-parser, cors,and nodemailer
const express=require('express');
const mysql = require('mysql2');
const doenv = require("dotenv");
const path = require("path");
const app = express();
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

// Parse URL-encoded bodies and JSON bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors('*'));


doenv.config({
    path: "./.env", //configurates path to .env file and loads variables
  });

// Creates connection between SQL database and host computer. 
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //proccess.env utilizes env variable
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

//Creates a message in the console when the middleware successfully connects to the SQL Database 
db.connect((err) => {
    if (err){
        console.log(err);
    }
    else{
        console.log("MySQL connection success")
    }
});


app.use(cookieParser());

//Express middleware function
app.use(express.urlencoded({extended: false}));

//Use of nodemailer package to send emails 
var nm = require('nodemailer');
  let savedPINS = {
  };
  var transporter = nm.createTransport( //Sends email through the node mailer
      {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
              user: 'resh.sud12@gmail.com',
              pass: 'ykzw djkz cptu chyi'
          }
      }
  );
  app.post('/sendotp', (req, res) => { 
     //sends one time password to requested email so user can create secure account   
      let email = req.body.email;
      let digits = '0123456789'; //Declares digits
      let limit = 4;
      let pin = ''
      for (i = 0; i < limit; i++) {
          pin += digits[Math.floor(Math.random() * 10)]; //randomizes 4-Digit Code
  
      }
      var options = {
          from: 'resh.sud12@gmail.com', //Sends from resh.sud12@gmail, to whatever email is entered in the frontend
          to: `${email}`,
          subject: "GPGenius Verification Code",
          html: `<p>Hello,</p><p>Thank you for Using GPGenius, an intuitive tool meant to calculate a Silver Creek High School Student's GPA. Please enter the following 4 digit code into your tab that has the website open.</p> <p> 4 Digit Code: ${pin}. Thank you once again, with this your data is safe with us!</p>`
  
      };
      transporter.sendMail( 
          options, function (error, info) { 
              if (error) { //returns error message if pin cannot be sent
                  console.log(error);
                  res.status(500).send("Couldn't send pin")
              }
              else {
                  savedPINS[email] = pin; //Clears pin after a certain amount of time
                  setTimeout(
                      () => {
                          delete savedPINS.email
                      }, 60000
                  )
                  res.send("Sent 4 Digit Pin") //Alerts user that pin has been sent
              }
  
          }
      )
  })
  
  app.post('/verify', (req, res) => { //verifies if a user entered the correct one time password from their email
      let pinrecived = req.body.pin;
      let email = req.body.email;
      if (savedPINS[email] == pinrecived) { //If the pin from the email and req.body.pin matches, then a user is vertified. 
          res.send("Verfied");
          res.send("Verfied");
      }
      else {
          res.status(500).send("Invalid 4 Digit Pin")
      }
  })
  
// Register handlebars partials
const location = path.join(__dirname, "./public"); //Creates path for public directory

// Set the static files location
app.use(express.static(location));
app.set("view engine","hbs");

const partialLoc = path.join(__dirname, "./views/partials"); //Creates a path for the partials directory --> A directory that decreases the repition of code. 
hbs.registerPartials(partialLoc);


app.use('/', require('./routes/pages'));  //If user is logged in, renders user information. 
app.use('/auth', require('./routes/auth')); //authorization of register, login, and logout

//Route to render Verification page as a page
app.get('/verify', (req, res) => {
    res.render('verify');
});

// Route to save GPA data to the database
app.post('/save-gpa', (req, res) => {
    const { email, className, grade, courseType, unweightedGPA, weightedGPA } = req.body;

    // Get the maximum instance number from the database
    db.query('SELECT MAX(instance) AS maxInstance FROM gpa_data', (err, result) => {
        if (err) throw err;

        const maxInstance = result[0].maxInstance || 0;
        const newInstance = maxInstance + 1;

        // Insert the GPA data into the database
        const query = 'INSERT INTO gpa_data (instance, EMAIL, class_name, grade, course_type, unweighted_gpa, weighted_gpa) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [newInstance, email, className, grade, courseType, unweightedGPA, weightedGPA], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save GPA data' });
            } else {
                res.status(200).json({ message: 'GPA saved successfully', instance: newInstance });
            }
        });
    });
});

//Listens to the Port and connects to localhost:5555
app.listen(5555,() => {
    console.log("Server started @ Port 5555");
});