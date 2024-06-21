const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");  

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.login = async(req,res) => {
    try {
        const {email,password} = req.body;
        if (!email || !password){
            return res.status(400).render('index', {msg:'Please provide email and password',msg_type: 'error'});
        }
        db.query("select * from users where email=?", [email], async(error,result) =>{
            console.log(result);
            if (result.length <= 0){
                return res.status(401).render('index',{msg:'Please provide valid email',msg_type: 'error'});
            }
            else if (!(await bcrypt.compare(password, result[0].PASS))){
                return res.status(401).render('index',{msg:'Password does not match!',msg_type: 'error'});
            }
            else {
                const id= result[0].ID;
                const token = jwt.sign({id: id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,
                });
                console.log("The token is: "+ token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() +
                        process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                };
                res.cookie("gpgeniustok",token,cookieOptions);
                res.status(200).redirect("/verify");
               // return res.render('index', {msg:'User Login Success',msg_type: 'good'});
            }
        }
      );
    }   catch (error) {
        console.log(error);
    }
};


exports.register = (req,res) => {
    console.log(req.body);
    /* const name = req.body.name;
    const email = req.body.email;
    const pass= req.body.pass;
    const confirmpass = req.body.confirmpass; */
    //res.send("Form Submitted");
    const {name,email,password,confirm_password} = req.body;
    /*console.log(name);
    console.log(email); 
    console.log(password);
    console.log(confirm_password); */
    db.query('select email from users where email=?',[email],async(error,result) => {
        if (error){
            console.log(error);
        }
        if(result.length>0){
            return res.render('register', {msg:'Email id already taken',msg_type: 'error'});
        } 
        else if(password !== confirm_password){
            return res.render('register', {msg:'Password does not match',msg_type: 'error'});
        }
        let hashedPassword = await bcrypt.hash(password,8);
        //console.log(hashedPassword);

        db.query('insert into users set ?', {name:name, email:email, pass:hashedPassword},(error,result)=>{
            if (error){
                console.log(error);
            }
            else {
                console.log(result);
                return res.render('register', {msg:'User Registration Success',msg_type: 'good'});
            }
        }
        );

    }
    );
    
};

exports.isLoggedIn = async(req,res,next) => {
    //console.log(req.cookies);
    if (req.cookies.gpgeniustok){
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.gpgeniustok,
                process.env.JWT_SECRET
            );
            //console.log(decode);
            db.query(
                "select * from users where id=?",
                [decode.id],
                (err,results) => {
                    //console.log(results);
                    if(!results){
                        return next();
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

exports.logout = async (req,res) => {
    res.cookie("gpgeniustok","logout",{
        expires: new Date(Date.now() + 2 *1000),
        httpOnly:true,
    });
    res.status(200).redirect("/index");
};


exports.verify = async (req,res) => {
    res.status(200).redirect("/verify");
}