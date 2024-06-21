const express=require('express');
const mysql = require('mysql2');
const doenv = require("dotenv");
const path = require("path");
const app = express();
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors('*'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


doenv.config({
    path: "./.env",
  });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err){
        console.log(err);
    }
    else{
        console.log("MySQL connection success")
    }
});


app.use(cookieParser());

app.use(express.urlencoded({extended: false}));


var nm = require('nodemailer');
  let savedOTPS = {
  };
  var transporter = nm.createTransport(
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
      let email = req.body.email;
      let digits = '0123456789';
      let limit = 4;
      let otp = ''
      for (i = 0; i < limit; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
  
      }
      var options = {
          from: 'yourmail@gmail.com',
          to: `${email}`,
          subject: "GPGenius Verification Code",
          html: `<p>Hello,</p><p>Thank you for Using GPGenius, an intuitive tool meant to calculate a Silver Creek High School Student's GPA. Please enter the following 4 digit code into your tab that has the website open.</p> <p> 4 Digit Code: ${otp}. Thank you once again, with this your data is safe with us!</p>`
  
      };
      transporter.sendMail(
          options, function (error, info) {
              if (error) {
                  console.log(error);
                  res.status(500).send("couldn't send")
              }
              else {
                  savedOTPS[email] = otp;
                  setTimeout(
                      () => {
                          delete savedOTPS.email
                      }, 60000
                  )
                  res.send("sent otp")
              }
  
          }
      )
  })
  
  app.post('/verify', (req, res) => {
      let otprecived = req.body.otp;
      let email = req.body.email;
      if (savedOTPS[email] == otprecived) {
          res.send("Verfied");
      }
      else {
          res.status(500).send("Invalid OTP")
      }
  })



const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine","hbs");

const partialLoc = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialLoc);

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.get('/verify', (req, res) => {
    res.render('verify');
});

app.post('/save-gpa', (req, res) => {
    const { email, className, grade, courseType, unweightedGPA, weightedGPA } = req.body;

    db.query('SELECT MAX(instance) AS maxInstance FROM gpa_data', (err, result) => {
        if (err) throw err;

        const maxInstance = result[0].maxInstance || 0;
        const newInstance = maxInstance + 1;

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

app.listen(5000,() => {
    console.log("Server started @ Port 5000");
});