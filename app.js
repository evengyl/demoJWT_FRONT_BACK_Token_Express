const express = require("express")
const app = express()
const port = process.env.PORT || 3333
const fs = require("fs")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.engine('html', require('ejs').renderFile)


let userInfos = {
  login : "Loïc",
  loginId : 42,
  email : "loic.baudoux@bstorm.be"
}

let loginInfos = {
  email : "test@test.be",
  pwd : "test1234"
}



//PART BACK
app.post("/login", (req, res, next) => {
  if(req.body.email && req.body.pwd)
  {
    if(req.body.email == loginInfos.email && req.body.pwd == loginInfos.pwd)
    {
      const privateKey = fs.readFileSync('./key/private.key')

      TOKEN = jwt.sign(userInfos, privateKey, { algorithm: 'RS256', expiresIn : "1m"})

      if(TOKEN === null)
      {
        res.status(500).json({error : "Token Non signable - Erreur interne au serveur"})
      }
      else
      {
        res.cookie("token", TOKEN, { sameSite: 'none', secure: true})
        res.status(200).render("login.ejs")
      }
    }
  }
})

verfifyToken = (req, res, next) => {
  const publicKey = fs.readFileSync('./key/public.pem')

  if(req.cookies.token)
  {
    DECODED = jwt.verify(req.cookies.token, publicKey)
    
    if(DECODED === null){
      res.status(401).render("403.ejs")
    }
    else{
      console.log("Token vérifié ok")
      next()
    }
  }
  else{
    res.status(403).render("403.ejs")
  }
  
}




//PART FRONT
app.get('/', (req, res, next) => { 
  res.redirect("/login")
})

app.get('/logout', (req, res, next) => {
  res.clearCookie("token")
  res.render("logout.ejs")
})

app.get('/login', (req, res, next) => { 
  res.render("login.ejs")
})

app.get("/contentNotLocked", (req, res, next) => {
  res.render("contentNotLocked.ejs")
})

app.get("/contentLocked", verfifyToken, (req, res, next) => {
  res.render("contentLocked.ejs")
})


app.listen(port, console.log(`Les serveur Express écoute sur le port ${port}`))