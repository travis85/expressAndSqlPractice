const { response } = require('express')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const models = require('./models')
const { user, password } = require('pg/lib/defaults')
const User = require('./models/user')
const app = express()
const PORT = process.env.PORT || 3000 
const session = require('express-session');
const { env } = require('process');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
var csurf = require('csurf')

app.set('view engine', 'ejs') //PROGRAM TO CONSTRUCT HTML FILES
app.set('views', path.join(__dirname, 'views')) //WHERE THE TEMPLATE FILE ARE AT RELATIVE TO EJS
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env['SESSION_SECRET'],
    store: new SequelizeStore({
    db: models.database,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    saveUninitialized: false
  })
);
app.use(csurf())

app.use(async (requst, response, next) => {
    try {
        await models.database.authenticate()
        await requst.sessionStore.sync({alter:true})

        console.log('authenticated success!')
    } catch(err) {
        next(err)
        console.log(err)
    }
    next()
})

app.get('/signUp', async (req, res) => {
    res.render('signUp', { err : false, surf: req.csrfToken()})
})

app.post('/signUp', async (req, res) => {
    const saltRounds = 10
    const hash = await bcrypt.hash(req.body.password, saltRounds) // HASHING PASSWORD
    try {
        await User.create({
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
    if ( await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
    } else {
        res.send('Not a valid User')
    }
            
    
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

