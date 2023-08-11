const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


const authRouter = require("./auth.routes.js")
router.use("/signup", authRouter)

module.exports = router;
