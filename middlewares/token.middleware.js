const fs = require("fs")
const jwt = require('jsonwebtoken')
const userInfos = require("../models/userInfos.model.json")



exports.addToken = (res) => {
    const privateKey = fs.readFileSync('./key/private.key')
  
    TOKEN = jwt.sign(userInfos, privateKey, { algorithm: 'RS256', expiresIn : "10s"})
  
    if(TOKEN === null)
    {
      res.status(500).json({error : "Token Non signable - Erreur interne au serveur"})
    }
    else
    {
      res.cookie("token", TOKEN, { sameSite: 'none', secure: true})
    }
}
  
  
exports.updateToken = (req, res, next) => {
  
    if(req.cookies.token)
    {
        const privateKey = fs.readFileSync('./key/private.key')
        
        TOKEN = jwt.sign(userInfos, privateKey, { algorithm: 'RS256', expiresIn : "5s"})
        
        if(TOKEN === null)
        {
            res.status(500).json({error : "Token Non signable - Erreur interne au serveur"})
        }
        else
        {
            res.cookie("token", TOKEN, { sameSite: 'none', secure: true})
            next()
        }
    }

    next()
}
  
exports.verfifyToken = (req, res, next) => {
    const publicKey = fs.readFileSync('./key/public.pem')
  
    if(req.cookies.token)
    {
        //gérer l'erreur d'expiration !
        DECODED = jwt.decode(req.cookies.token)
        dateNow = Math.floor(Date.now() / 1000)
        
        if(dateNow >= DECODED.exp)
        {
            res.status(401).render("401.ejs")
        }
        else
        {
            VERIFY = jwt.verify(req.cookies.token, publicKey)
            if(VERIFY === null)
            {
                res.status(401).render("401.ejs")
            }
            else
            {
                console.log("Token vérifié ok")
                next()
            }
        }
    }
    else
    {
        res.status(401).render("401.ejs")
    }   
} 

exports.logoutToken = (req, res, next) => {
    res.clearCookie("token")
    next()
}