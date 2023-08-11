const express = require('express');
const router = express.Router();

const User = require("../models/User.model.js")


// GET "/signup" => Enseñar vista de formulario

router.get("/", (req, res, next) =>{
    res.render("signup.hbs")
})

// POST "/signup" => Enviar los datos del formulario a la DB

router.post("/", async (req, res, next)=> {
   
    const {username, email, password, userType} = req.body
    try {
        
        await User.create({
            username,
            email,
            password,
            userType
        })
    } catch (error) {
        next(error)
    }
})

module.exports =router