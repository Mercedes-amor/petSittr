const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");

// GET "/owner/petlist" => Enseñar vista de mascotas
router.get("/petlist", async (req, res, next) => {
    try {
        const allOwnerPets = await Pet.find({owner:req.session.user._id});
        res.render("owner/petlist.hbs", {
            allOwnerPets
        })
    } catch (error) {
        next(error);
    }
})

// GET "/owner/addPet" => Enseñar vista para añadir mascota
router.get("/add-pet", (req, res, next) => {
    res.render("owner/addpet.hbs")
})

// POST "/owner/addPet" => añade mascota a db
router.post("/add-pet", async (req, res, next) => {
    const { name, animalType, race, size, dateOfBirth, comment } = req.body
    // console.log(req.session.user._id)
    if (name === "" || animalType === "" || size === "") {
        res.status(400).render("owner/addpet.hbs", {
            errorMessage: "name, animal Type,size, fields are required"
        })
        return
    }
    try {
        await Pet.create({
            name,
            animalType,
            race,
            size,
            dateOfBirth,
            owner: req.session.user._id,
            comment
        })
        res.redirect("/owner/petlist")
    } catch (error) {
        next(error)
    }
})

// GET de "/owner/edit-pet/:petId" => Enseñar vista para editar mascota
router.get("/edit-pet/:petId", async (req, res, next) => {
    let isDog = false
    let isSmall = false
    let isMedium = false
    let isBig = false
    let isDate = false
    try {
        const petToEdit = await Pet.findById(req.params.petId)
        if (petToEdit.animalType === "dog") {
            //     console.log("DOGGY")
            isDog = true
        } else {
            isDog = false
        }
        if (petToEdit.size === "small") {
            isSmall = true
        } else if (petToEdit.size === "medium") {
            isMedium = true
        } else if (petToEdit.size === "big") {
            isBig = true
        }

        // console.log("dateOfBirth",petToEdit.dateOfBirth)
        if (petToEdit.dateOfBirth !== null) {
            dateOfBirthForHTML = petToEdit.dateOfBirth.toISOString().split("T")[0]
            res.render("owner/editpet.hbs", {
                petToEdit, isDog, isSmall, isMedium, isBig, dateOfBirth: dateOfBirthForHTML
            })
              
        } else {
            res.render("owner/editpet.hbs", {
            petToEdit, isDog, isSmall, isMedium, isBig
        })  
        } 

       
    } catch (error) {
        next(error)
    }
})


// POST "/owner/edit-pet/:petId" => edita mascota en db
router.post("/edit-pet/:petId", async (req, res, next) => {
    const { name, animalType, race, size, dateOfBirth, comment } = req.body
    // console.log(req.session.user._id)
    if (name === "" || animalType === "" || size === "") {
        res.status(400).render("owner/editpet.hbs", {
            errorMessage: "name, animal Type,size, fields are required"
        })
        return
    }
    try {
        await Pet.findByIdAndUpdate(req.params.petId, {
            name,
            animalType,
            race,
            size,
            dateOfBirth,
            comment
        })
        res.redirect("/owner/petlist")
    } catch (error) {
        next(error)
    }
})

// GET "/owner/delete-pet/:petId" => Enseñar vista para añadir mascota
router.get("/delete-pet/:petId", async (req, res, next) => {
    await Pet.findByIdAndDelete(req.params.petId)
    res.redirect("/owner/petlist")
})


//GET "owner/add-job" => Enseñar formulario de creación job
router.get("/add-job", async (req, res, next) => {
  const ownerPets = await Pet.find({owner:req.session.user._id})
    res.render("owner/jobadd.hbs", {ownerPets})
})

// POST "/owner/addJob" => añade job a db
router.post("/add-job", async (req, res, next) => {
    const { pet, city, startDate, endDate, comment  } = req.body
    console.log(pet)

    try {
        if (pet === "" || city === "" || startDate === "" || endDate === "") {
            const ownerPets = await Pet.find({owner:req.session.user._id})
            res.status(400).render("owner/jobadd.hbs", {
                errorMessage: "pet, city and dates are fields are required",
                ownerPets
            })
            return
        }
        await Job.create({
            owner: req.session.user._id,
            pet, 
            city, 
            startDate, 
            endDate, 
            comment 
        })
        res.redirect("/owner/joblist")
    } catch (error) {
        next(error)
    }
})

// GET "/owner/joblist" => Enseñar vista de jobs
router.get("/joblist", async (req, res, next) => {
    try {
        const ownerJobs = await Job.find({owner:req.session.user._id});
        res.render("owner/joblist.hbs", {
            ownerJobs
        })
    } catch (error) {
        next(error);
    }
})







module.exports = router;