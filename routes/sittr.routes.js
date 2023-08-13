const express = require('express');
const router = express.Router();

const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");



// GET "/sittr/joblist" => Enseñar vista de jobs
router.get("/joblist/", async (req, res, next) => {
    try {
        const jobsList = await Job.find().populate("pet");
        res.render("sittr/joblist.hbs", {
            jobsList
        })
    } catch (error) {
        next(error);
    }
})


// POST "/sittr/joblist" => Enseñar vista de jobs Filtrados
router.post("/joblist", async (req, res, next) => {
const { city , animalType} = req.body
if (animalType === "" || city === "" ) {
    const jobsList = await Job.find().populate("pet")
    res.status(400).render("sittr/joblist.hbs", {
        errorMessage: "pet, animal Type are fields are required",
        jobsList
    })
    return
}
console.log (req.body)
    try {
        const jobsList = await Job
        .find({city, animalType})
        .populate("pet");
        res.render("sittr/joblist.hbs", {
            jobsList
        })
    } catch (error) {
        next(error);
    }
})



//continue
//continue Mercedes





module.exports = router;