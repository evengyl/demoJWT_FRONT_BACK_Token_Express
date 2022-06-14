const express = require("express")
const app = express()
const port = process.env.PORT || 3333
const cookieParser = require('cookie-parser')
const tokenMiddleware = require("./middlewares/token.middleware")
const loginInfos = require("./models/loginInfos.model.json")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.engine('html', require('ejs').renderFile)


//PART BACK
app.all("*", tokenMiddleware.updateToken, (req, res, next) => {
  next()
})


app.post("/login", (req, res, next) => {
  if(req.body.email && req.body.pwd)
  {
    if(req.body.email == loginInfos.email && req.body.pwd == loginInfos.pwd)
    {
      tokenMiddleware.addToken(res)
      res.status(200).render("login.ejs")
    }
  }
})




//PART FRONT
app.get('/', (req, res, next) => { 
  res.redirect("/login")
})

app.get('/logout', tokenMiddleware.logoutToken, (req, res, next) => {
  res.status(200).render("logout.ejs")
})

app.get('/login', (req, res, next) => { 
  res.status(200).render("login.ejs")
})

app.get("/contentNotLocked", (req, res, next) => {
  res.status(200).render("contentNotLocked.ejs")
})

app.get("/contentLocked", tokenMiddleware.verfifyToken, tokenMiddleware.updateToken, (req, res, next) => {
  res.status(200).render("contentLocked.ejs")
})


app.listen(port, console.log(`Les serveur Express écoute sur le port ${port}`))