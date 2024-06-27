// Declare packages needed in user.js
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");  

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// Login function
exports.login = async(req,res) => {
    try {
        // Extract email and password from the request body
        const {email,password} = req.body;
        
        // Check if email and password are provided
        if (!email || !password){
            return res.status(400).render('index', {msg:'Please provide email and password',msg_type: 'error'});
        }
        
        // Query the database to find the user with the provided email
        db.query("select * from users where email=?", [email], async(error,result) =>{
            //console.log(result);
            // Check if user exists
            if (result.length <= 0){
                return res.status(401).render('index',{msg:'Please provide valid email',msg_type: 'error'});
            }

            // Check if password matches
            else if (!(await bcrypt.compare(password, result[0].PASS))){
                return res.status(401).render('index',{msg:'Password does not match!',msg_type: 'error'});
            }
            else {
                // Generate JWT token
                const id= result[0].ID;
                const mail1 = result[0].EMAIL;
                console.log(mail1);
               
                const token = jwt.sign({id: id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,
                });
                console.log("The token is: "+ token);
                
                // Set cookie options
                const cookieOptions = {
                    expires: new Date(
                        Date.now() +
                        process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                };
                
                const token1 = jwt.sign({mail1},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,
                });
                console.log("The token is: "+ token1);
                const cookieOptions1 = {
                    expires: new Date(
                        Date.now() +
                        process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                };

                // Set the token in the cookie and redirect to verify page
                res.cookie("gpgeniustok",token,cookieOptions);
                res.cookie("gpgeniustok2",token1,cookieOptions1);
                res.status(200).redirect("/verify");
                        }
        }
      );
    }   catch (error) {
        console.log(error);
    }
};

// Register function
exports.register = (req,res) => {
    console.log(req.body);
    const {name,email,password,confirm_password} = req.body; // All of these in req.body
    db.query('select email from users where email=?',[email],async(error,result) => {
        if (error){
            console.log(error);
        }
        if(result.length>0){ //checks if email id has been taken
            return res.render('register', {msg:'Email id already taken',msg_type: 'error'});
        } 
        else if(password !== confirm_password){ //checks if passwords match
            return res.render('register', {msg:'Password does not match',msg_type: 'error'});
        }

        // Hash/encrypt the password 8 times before sending it into database
        let hashedPassword = await bcrypt.hash(password,8);

        db.query('insert into users set ?', {name:name, email:email, pass:hashedPassword},(error,result)=>{
            if (error){
                console.log(error); //unsuccessfully not registed the account to the database
            }
            else { //user successfully regisered their account into the database
                console.log(result);
                return res.render('register', {msg:'User Registration Success',msg_type: 'good'});
            }
        }
        );

    }
    );
    
};

// Checks if user is logged in. 
exports.isLoggedIn = async(req,res,next) => {
    if (req.cookies.gpgeniustok){ //if there are cookies
        try {
            const decode = await promisify(jwt.verify)( //decode the cookies and keep it private
                req.cookies.gpgeniustok,
                process.env.JWT_SECRET
            );
            db.query( //sq
                "select * from users where id=?",
                [decode.id],
                (err,results) => {
                    if(!results){
                        return next(); //if it does not match results, move onto the next person
                    }
                    req.user = results[0]; 
                    return next();
                }
            );
        } catch (error){
            console.log(error);
            return next();
        }
    }
    else {
        next();
    }

};

exports.isLoggedIn1 = async(req,res,next) => {
    if (req.cookies.gpgeniustok2){ //if there are cookies
        try {
            const decode = await promisify(jwt.verify)( //decode the cookies and keep it private
                req.cookies.gpgeniustok2,
                process.env.JWT_SECRET
            );
            console.log(decode);
            db.query( //sq
                "select users.EMAIL, users.NAME, gpa_data.class_name, gpa_data.grade, gpa_data.course_type, gpa_data.unweighted_gpa, gpa_data.weighted_gpa from users INNER JOIN gpa_data on users.EMAIL = gpa_data.EMAIL where users.EMAIL = ?",
                [decode.mail1],
                (err,results1) => {
                    if(!results1){
                        return next(); //if it does not match results, move onto the next person
                    }
                    req.user = results1; 
                    console.log(req.user);
                    return next();
                }
            );
        } catch (error){
            console.log(error);
            return next();
        }
    }
    else {
        next();
    }

};

// allows user to logout and redirect to index page. 
exports.logout = async (req,res) => {
    res.cookie("gpgeniustok","logout",{
        expires: new Date(Date.now() + 2 *1000),
        httpOnly:true,
    });
    res.status(200).redirect("/index");
};
