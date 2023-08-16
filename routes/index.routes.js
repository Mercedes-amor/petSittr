const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js")
const bcrypt = require("bcryptjs")

const { isLoggedIn, isOwner, isSittr } = require("../middlewares/roles.middlewares.js")
/*router.use(isLoggedIn)*/
const { isUserLocals } = require("../middlewares/roles.middlewares.js")
router.use(isUserLocals)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//LOGIN
router.post("/", async (req, res, next) => {
  const { email, password,RemeberMe } = req.body
  try {
    const foundUser = await User.findOne({ email: email })
     console.log("from user with love ", foundUser)
    if (foundUser === null) {
      res.status(400).render("index.hbs", {
        errorMessage: "User not found"
      })
      return
    }
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)

    if (foundUser.email === email && isPasswordCorrect === true) {
      // console.log(foundUser.username)
      //! crear una sesion activa del usuario
      req.session.user = {
        _id: foundUser._id,
        userType: foundUser.userType,
        userName: foundUser.username
        
      }
      //! guardamos en la sesion informacion del usuario que no deberia cambiar
      //! el metodo .save() se invoca para esperar que se crea la sesion antes de hacer lo siguiente
      

      //1 hour sessions
      if(RemeberMe === undefined) {
        req.session.cookie.maxAge = 1 * 60 * 60 * 1000
      }
      
      req.session.save(() => {
        if(req.session.user.userType === "owner") {
          res.redirect("/owner/petlist")
        }else if(req.session.user.userType === "sittr") {
          res.redirect("/sittr/job-list-accepted")
        }
      })
    }
    else {
      res.status(400).render("index.hbs", {
        errorMessage: "Incorrect password or email"
      })
    }
  } catch (error) {
    next(error)
  }
})

//LOGOUT

  router.get("/logout", (req,res,next) =>{
    req.session.destroy(() =>{
      res.redirect("/")
    })
  })




const authRouter = require("./auth.routes.js")
router.use("/signup", authRouter)

const ownerRouter = require("./owner.routes.js")
router.use("/owner", isLoggedIn, isOwner, ownerRouter)

const sittrRouter = require("./sittr.routes.js")
router.use("/sittr", isLoggedIn, isSittr, sittrRouter)


module.exports = router;
