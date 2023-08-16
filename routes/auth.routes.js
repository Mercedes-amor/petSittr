const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")

const User = require("../models/User.model.js")


// GET "/signup" => Enseñar vista de formulario

router.get("/", (req, res, next) =>{
    res.render("signup.hbs")
})

// POST "/signup" => Enviar los datos del formulario a la DB

router.post("/", async (req, res, next)=> {
   const {username, email, password,password2, userType} = req.body
   if (username === "" || email === "" || password === "" || userType === "" || password !== password2 ) {
    res.status(400).render("signup.hbs", {username, email, userType,
        errorMessage: "All fields are required & passwords must match"
    })
return
   }

   //Condiciones cifrado contraseña
   const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm
   if (regexPassword.test(password) === false) {
     res.status(400).render("signup.hbs", {username, email, userType,
       errorMessage: "The password must have at least one uppercase, one lowercase, one special character and be 5 characters or more"
     })
     return; 
   }
    try {
        //Comprobación no existe un usuario previo con el mismo email
        const foundUser = await User.findOne({email: email})
        console.log(foundUser)
        if (foundUser !== null) {
          res.status(400).render("signup.hbs", {
            errorMessage: "There is already a user with this email"
          })
          return; 
        }

         //Cifrado de la contraseña
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        console.log(passwordHash)


        
        const newUser = await User.create({
            username,
            email,
            password: passwordHash,
            userType
        })

    
        req.session.user = {
          _id: newUser._id,
          userType: newUser.userType
        }

        req.session.save(() => {
          if(req.session.user.userType === "owner") {
            res.redirect("/owner/petlist")
          }else if(req.session.user.userType === "sittr") {
            res.redirect("/sittr/job-list-accepted")
          }
        })
        
    } catch (error) {
        next(error)
    }
})

module.exports =router