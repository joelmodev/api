const express = require('express')
const bodyParser = require('body-parser');
const ejs = require('ejs')
require('dotenv').config()
const session = require('express-session')

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const emailSender = require('./modules/nodemailer');

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, `./files/${req.session.userId}/files`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '_'+ file.originalname)
    }
})
const upload = multer({ storage: storage })

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: true
    }
}))


const connection = require('./modules/mysql.js');

const redirectLogin = (req, res, next) =>{
    if(!req.session.userId){
        res.redirect('/login')
    }else{
        next()
    }
}
const redirectHome = (req, res, next) =>{
    if(req.session.userId){
        res.redirect('/dash')
    }else{
        next()
    }
}




app.get('/', (req, res) =>{
    res.render('index')
})
app.get('/login', redirectHome, (req, res) =>{
    res.render(__dirname + '/views/oauth/login')
})
app.get('/register', redirectHome, (req, res) =>{
    res.render(__dirname + '/views/oauth/register')
})
app.get('/dash',redirectLogin, (req, res) =>{    
    function getDate(){
        now = new Date
    const data = now.getHours()
    if(data <= 12 && data >= 1){
        return "Bom dia"
    }
    if(data >= 17 && data <= 0){
        return "Boa Noite"
    }
    if(data >= 12 && data <= 17){
        return "Boa tarde"
    }
    }
    res.render(__dirname + '/views/dash/home', {
        name: req.session.name,
        email: req.session.email,
        user_id: req.session.userId,
        saudacao: getDate(),
    })
});

/*

    OAuth Routes

*/

app.post('/api/oauth/register', redirectHome, (req, res) =>{
    const id = Math.ceil(Date.now() * Math.random(1, 1000))
    const { password, email, name} = req.body
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    connection.query("SELECT * FROM `users` WHERE `email`=" + `'${email}'`, function (error, results, fields) {
       if(results.length == 0){
        connection.query('INSERT INTO `users` (`id`, `email`, `name`, `password`) VALUES' + ` ('${id}', '${email}', '${name}', '${hash}')`, function (error, results, fields) {
            res.jsonp({status: 'success'})
            if(error) throw error
        });
       }else{
            res.jsonp({status: 'error'})
       }
    });
})
app.post('/api/oauth/login',  redirectHome, (req, res) =>{
    const {email, password} = req.body

    if(email && password){
        connection.query('SELECT * FROM `users` WHERE `email` =' + `"${email}"`, function (error, results, fields) {
            if(results.length == 0){
                res.status(404).jsonp({message:'Usuário não encontrado'})
            }else{
                if(bcrypt.compareSync(password, results[0].password)){
                    req.session.userId = results[0].id
                    req.session.email = results[0].email
                    req.session.name = results[0].name
                    res.jsonp({status: 'success'})
                }else{
                    res.jsonp({status: 'error'})
                }
            }
        })
    }
})
app.get('/api/oauth/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err)
            res.redirect('/dash')
        }
        res.clearCookie('sid')
        res.redirect('/login')
    })
})
app.get('/resetpass', (req, res) => {
    if(req.query.token){
        res.render(__dirname + '/views/oauth/forgetpass',{
            type: 'newPassword',
            token: req.query.token
        })
    }else{
        res.render(__dirname + '/views/oauth/forgetpass',{
            type: 'none'
        })
    }
    
})
app.post('/api/changepassword', (req, res) => {
    const {password} = req.body
    const id = req.session.userId
    const hashPassword = bcrypt.hashSync(password, salt)
   connection.query('SELECT * FROM `users` WHERE `id`= '+ `'${id}'`, function (error, results, fields) { 
        connection.query('UPDATE `users` SET `password`= '+ `'${hashPassword}'` + 'WHERE `id` =' + `'${id}'`, function (error, results, fields) {                    
            if(error){
                res.jsonp({status: 'error'})
            }else{
                res.jsonp({status: 'success'})
            }
        })
    })
    
    
})
app.post('/api/oauth/forgetpassword', redirectHome, (req, res) => {
    const {token, newPass} = req.body
    const hashPassword = bcrypt.hashSync(newPass, salt);
    connection.query('SELECT * FROM `reset-token` WHERE `token` =' +  `'${token}'`, function (error, results, fields) {
        if(results.length != 0){
            const id = results[0].id
            connection.query('SELECT * FROM `users` WHERE `id` =' + `'${id}'`, function (error, results, fields) {
                if(results.length != 0){
                connection.query('UPDATE `users` SET `password`= '+ `'${hashPassword}'` + 'WHERE `id` =' + `'${results[0].id}'`, function (error, results, fields) {                    
                    res.jsonp({status: 'success'})
                    connection.query('DELETE FROM `reset-token` WHERE token =' + `'${token}'`)
                }) 
            }else{
                res.jsonp({status: 'error', message: "Não tem com esse id"})
            }
        })
        }else{
            res.jsonp({status: 'error', type: 'Invalid Token'})
        }

    })


})

app.post('/api/oauth/forgetpassword/email', redirectHome, (req, res) => {
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    const {email} = req.body
    const token = makeid(50)
    const link = `http://localhost:3001/resetpass?token=${token}`
    connection.query('SELECT * FROM `users` WHERE `email` =' +  `'${email}'`, function (error, results, fields) {
        if(results.length != 0){
            var username = results[0].name
            connection.query('INSERT INTO `reset-token`(`id`, `email`, `token`, `timestamp`) VALUES' + `('${results[0].id}', '${email}', '${token}', '${Date.now()}')`, function (error, results, fields) {
                emailSender.forgetEmail(username, link, email);
                res.jsonp({status: 'success'})
            })
        }else{
            res.jsonp({status: 'error'})
        }
    })
})
app.post('/api/upload', upload.single('file'), (req, res) => {
    const string = req.file.originalname.split('_')
    connection.query('INSERT INTO `files`(`id`, `originalname`, `storagename`, `userId`) VALUES' + `('${string}','${req.file.originalname}','${req.file.filename}','1234')`, function (results) {
        res.jsonp({status: success})
    });
    
})


app.listen(3001, () =>{
    console.log(`App rodando em http://localhost:${3001}`)
})

function checkResetLinks(){
    connection.query('SELECT * FROM `reset-token`', function (error, results, fields) {
        if(results.length != 0){
            var id = results[0].id 
            if(86400000 + results[0].timestamp == Date.now()){
                connection.query('DELETE FROM `reset-token` WHERE `id` = ' + `${id}`, function (error, results, fields) {})
            }
        }
    })    
}
setInterval(checkResetLinks, 1000 * 60 )

