const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");


// GET "/owner/petlist" => Enseñar vista de mascotas
router.get("/petlist", async(req, res, next) => {
try {
    const allOwnerPets = await Pet.find();
console.log(allOwnerPets)


} catch (error) {
    next(error);
}


    res.render("owner/petlist.hbs")
})

// GET "/owner/addPet" => Enseñar vista para añadir mascota
router.get("/add-pet", (req, res, next) => {
 
        res.render("owner/addpet.hbs")
    })

// POST "/owner/addPet" => añade mascota a db
    router.post("/add-pet", async (req, res, next)=> {
        const {name, animalType, race, size,dateOfBirth,comment} = req.body
        console.log(req.session.user._id)
        if (name === "" ||animalType === "" || size === "" ) {
           
         res.status(400).render("/add-pet.hbs", {
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
















    





module.exports = router;