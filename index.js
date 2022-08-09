const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const models = require('./models')
const User = require('./models/user')
const app = express()
const PORT = process.env.PORT || 3000 
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require('csurf')

app.set('view engine', 'ejs') //PROGRAM TO CONSTRUCT HTML FILES
app.set('views', path.join(__dirname, 'views')) //WHERE THE TEMPLATE FILE ARE AT RELATIVE TO EJS
app.use(bodyParser.urlencoded({ extended: true }))

const sess ={  //MIDDLEWARE THAT ALLOWS US TO KEEP TRACK OF USERS BY STORING COOKIES IN THERE BROWSER TO IDENTIFY THEM (ENCRYPTION/ DECRYPTION)
    secret: process.env['SESSION_SECRET'],
    store: new SequelizeStore({ // STORES DATA ON BEHALF OF USER BETWEEN OUR DATABASE AND OUR SERVER (ORM - OBJECT RELATIONAL MAPPER)
    db: models.database,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    saveUninitialized: false
} 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(
  session(sess)
);


app.use(csurf()) //PREVENTS CROSS SITE REQUEST FORGERY (https://owasp.org/www-community/attacks/csrf)

app.use(async (requst, response, next) => {
    try {
        await models.database.authenticate() // CONNECTING USER TO DATABASE
        await models.database.sync({alter:true}) // CONFIGURES DATABASE TO DESCRIPTION OF REQUEST

        console.log('authenticated success!')
    } catch(err) {
        next(err)
        console.log(err)
    }
    next()
})


// Browser makes request -> Express does stuff -> body is parsed -> session is created or located -> CSRF info is checked -> DB authentication/connection -> Route handler sends response

app.get('/signUp', async (req, res) => {
    res.render('signUp', { err : false, surf: req.csrfToken()})
})

app.post('/signUp', async (req, res) => {
    const saltRounds = 10
    const hash = await bcrypt.hash(req.body.password, saltRounds) // HASHING PASSWORD
    try {
        await User.create({ // SETS UP NEW USER (USER.JS)
            userName: req.body.userName,
            name: req.body.name,
            email: req.body.email,
            password: hash,
        })
    } catch(err) {
        res.render('signUp', { err , surf : req.csrfToken()})
        console.log(err)
        return
    } 
    res.send('post success')
})

app.get('/logIn', async (req, res) => {
    res.render('logIn', {surf : req.csrfToken()})
})
app.post('/logIn', async (req, res) => { 
    
    const user = await User.findOne({where: { userName: req.body.userName }})
    if ( user && await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
    } else {
        res.send('Not a valid User')
    }
     console.log(req.session.userid)
            
    
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

