const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");

const dateFixer = require("../utils/jobDateFixer.js");

const uploader = require("../middlewares/cloudinary.middlewares.js");

// GET "/owner/petlist" => Enseñar vista de mascotas
router.get("/petlist", async (req, res, next) => {
  try {
    let allOwnerPets = await Pet.find({ owner: req.session.user._id });
    let allOwnerPetsDatesFix = JSON.parse(JSON.stringify(allOwnerPets));

    allOwnerPetsDatesFix.forEach((pet) => {
      if (pet.dateOfBirth !== null) {
        const formatedDate = new Date(pet.dateOfBirth);
        pet.dateOfBirth = formatedDate.toISOString().split("T")[0];
      }
    });

    allOwnerPets = allOwnerPetsDatesFix;

    res.render("owner/petlist.hbs", {
      allOwnerPets,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/owner/addPet" => Enseñar vista para añadir mascota
router.get("/add-pet", (req, res, next) => {
  const isSmall = true;
  res.render("owner/addpet.hbs", {
    isSmall,
  });
});

// POST "/owner/addPet" => añade mascota a db
router.post("/add-pet", uploader.single("picture"), async (req, res, next) => {
  const { name, animalType, race, size, dateOfBirth, comment } = req.body;
  let petprofilePic = "";
  if (req.file === undefined) {
    petprofilePic =
      "https://img.freepik.com/vector-premium/icono-perro-gato-estilo-plano-ilustracion-vector-cabeza-animal-sobre-fondo-blanco-aislado_740527-4.jpg?w=996";
  } else {
    petprofilePic = req.file.path;
  }
  let isDog = false;
  let isSmall = false;
  let isMedium = false;
  let isBig = false;
  if (animalType === "dog") {
    //     console.log("DOGGY")
    isDog = true;
  } else {
    isDog = false;
  }
  if (size === "small") {
    isSmall = true;
  } else if (size === "medium") {
    isMedium = true;
  } else if (size === "big") {
    isBig = true;
  }

  // console.log(req.session.user._id)
  if (name === "" || animalType === "" || size === "") {
    res.status(400).render("owner/addpet.hbs", {
      errorMessage: "name, animal Type,size, fields are required",
      name,
      animalType,
      race,
      size,
      dateOfBirth,
      comment,
      picture: petprofilePic,
      isDog,
      isSmall,
      isMedium,
      isBig,
    });
    return;
  }
  try {
    // let petprofilePic = "";
    // if (req.file === undefined) {
    //   petprofilePic =
    //     "https://img.freepik.com/vector-premium/icono-perro-gato-estilo-plano-ilustracion-vector-cabeza-animal-sobre-fondo-blanco-aislado_740527-4.jpg?w=996";
    // } else {
    //   petprofilePic = req.file.path;
    // }

    console.log(petprofilePic);
    await Pet.create({
      name,
      animalType,
      race,
      size,
      dateOfBirth,
      owner: req.session.user._id,
      comment,
      picture: petprofilePic,
    });
    res.redirect("/owner/petlist");
  } catch (error) {
    next(error);
  }
});

// GET de "/owner/edit-pet/:petId" => Enseñar vista para editar mascota
router.get("/edit-pet/:petId", async (req, res, next) => {
  let isDog = false;
  let isSmall = false;
  let isMedium = false;
  let isBig = false;
  try {
    const petToEdit = await Pet.findById(req.params.petId);
    if (petToEdit.animalType === "dog") {
      //     console.log("DOGGY")
      isDog = true;
    } else {
      isDog = false;
    }
    if (petToEdit.size === "small") {
      isSmall = true;
    } else if (petToEdit.size === "medium") {
      isMedium = true;
    } else if (petToEdit.size === "big") {
      isBig = true;
    }

    // console.log("dateOfBirth",petToEdit.dateOfBirth)
    if (petToEdit.dateOfBirth !== null) {
      dateOfBirthForHTML = petToEdit.dateOfBirth.toISOString().split("T")[0];
      res.render("owner/editpet.hbs", {
        petToEdit,
        isDog,
        isSmall,
        isMedium,
        isBig,
        dateOfBirth: dateOfBirthForHTML,
      });
    } else {
      res.render("owner/editpet.hbs", {
        petToEdit,
        isDog,
        isSmall,
        isMedium,
        isBig,
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST "/owner/edit-pet/:petId" => edita mascota en db
router.post(
  "/edit-pet/:petId",
  uploader.single("picture"),
  async (req, res, next) => {
    const { name, animalType, race, size, dateOfBirth, comment } = req.body;

    let petprofilePic = "";
    if (req.file === undefined) {
      petprofilePic =
        "https://img.freepik.com/vector-premium/icono-perro-gato-estilo-plano-ilustracion-vector-cabeza-animal-sobre-fondo-blanco-aislado_740527-4.jpg?w=996";
    } else {
      petprofilePic = req.file.path;
    }
    let isDog = false;
    let isSmall = false;
    let isMedium = false;
    let isBig = false;
    if (animalType === "dog") {
      //     console.log("DOGGY")
      isDog = true;
    } else {
      isDog = false;
    }
    if (size === "small") {
      isSmall = true;
    } else if (size === "medium") {
      isMedium = true;
    } else if (size === "big") {
      isBig = true;
    }

    const petToEdit = await Pet.findById(req.params.petId);

    // console.log(req.session.user._id)
    if (name === "" || animalType === "" || size === "") {
      res.status(400).render("owner/editpet.hbs", {
        petToEdit,
        // res.status(400).redirect(`/owner/edit-pet/${req.params.petId}`, {

        errorMessage: "name, animal Type,size, fields are required",
        name,
        animalType,
        race,
        size,
        dateOfBirth,
        comment,
        picture: petprofilePic,
        isDog,
        isSmall,
        isMedium,
        isBig,
      });
      return;
    }
    try {
      let petprofilePic = "";
      if (req.file === undefined) {
        await Pet.findByIdAndUpdate(req.params.petId, {
          name,
          animalType,
          race,
          size,
          dateOfBirth,
          comment,
        });
        console.log("no file");
      } else {
        petprofilePic = req.file.path;

        await Pet.findByIdAndUpdate(req.params.petId, {
          name,
          animalType,
          race,
          size,
          dateOfBirth,
          comment,
          picture: petprofilePic,
        });
      }

      res.redirect("/owner/petlist");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/owner/delete-pet/:petId" => Enseñar vista para añadir mascota
router.get("/delete-pet/:petId", async (req, res, next) => {
  await Pet.findByIdAndDelete(req.params.petId);
  res.redirect("/owner/petlist");
});

//     JOBS    //

//GET "owner/add-job" => Enseñar formulario de creación job
router.get("/add-job", async (req, res, next) => {
  const ownerPets = await Pet.find({ owner: req.session.user._id });
  res.render("owner/jobadd.hbs", { ownerPets });
});

// POST "/owner/addJob" => añade job a db
router.post("/add-job", async (req, res, next) => {
  const { pet, city, startDate, endDate, comment } = req.body;
  console.log(pet);

  try {
    if (
      pet === "" ||
      city === "" ||
      startDate === "" ||
      endDate === "" ||
      startDate >= endDate ||
      new Date(startDate) < new Date() ||
      new Date(endDate) < new Date()
    ) {
      const ownerPets = await Pet.find({ owner: req.session.user._id });
      res
        .status(400)
        .render("owner/jobadd.hbs", {
          pet,
          city,
          startDate,
          endDate,
          comment,
          errorMessage:
            "pet, city and dates are fields are required  start date can't be greater than end date, date can´tbe longer than today",
          ownerPets,
        });
      return;
    }
    await Job.create({
      owner: req.session.user._id,
      pet,
      city,
      startDate,
      endDate,
      comment,
    });
    res.redirect("/owner/joblist");
  } catch (error) {
    next(error);
  }
});

// GET "/owner/joblist" => Enseñar vista de jobs
router.get("/joblist", async (req, res, next) => {
  try {
    let ownerJobs = await Job.find({ owner: req.session.user._id })
      .sort({ status: -1 })
      .populate("pet sittr");

    ownerJobs = dateFixer(ownerJobs);

    res.render("owner/joblist.hbs", {
      ownerJobs,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/owner/delete-job/:jobId" => Eliminar job con status pending
router.get("/delete-job/:jobId", async (req, res, next) => {
  try {
    const jobToDelete = await Job.findById(req.params.jobId);
    if (jobToDelete.status === "pending") {
      await Job.findByIdAndDelete(req.params.jobId);
      res.redirect("/owner/joblist");
    } else {
      const ownerJobs = await Job.find({
        owner: req.session.user._id,
      }).populate("pet");
      res.status(400).render("owner/joblist.hbs", {
        ownerJobs,
        errorMessage2: "Can't delete a executing/concluded job",
      });
    }
  } catch (error) {}
});

// GET de "/owner/edit-job/:jobId" => Enseñar vista para editar Job
router.get("/edit-job/:jobId", async (req, res, next) => {
  // console.log(req.params.jobId)

  try {
    let jobToEdit = await Job.findById(req.params.jobId).populate("pet");
    if (jobToEdit.status === "pending") {
      let ownerPets = await Pet.find({
        owner: req.session.user._id,
      }).populate("owner");
      const startDateForHTML = jobToEdit.startDate.toISOString().split("T")[0];
      const endDateForHTML = jobToEdit.endDate.toISOString().split("T")[0];

      ownerPets = JSON.parse(JSON.stringify(ownerPets));
      jobToEdit = JSON.parse(JSON.stringify(jobToEdit));

      jobToEdit.pet.forEach((jobSelectedPet) => {
        ownerPets.forEach((eachPet) => {
          if (jobSelectedPet._id === eachPet._id) {
            eachPet.isSelected = true;
          }
        });
      });

      res.render("owner/jobedit.hbs", {
        jobToEdit,
        startDateForHTML,
        endDateForHTML,
        ownerPets,
      });
      // console.log("jobToEdit", jobToEdit);
    } else {
      let ownerJobs = await Job.find({
        owner: req.session.user._id,
      }).populate("pet");
      ownerJobs = dateFixer(ownerJobs);
      res.status(400).render("owner/joblist.hbs", {
        ownerJobs,
        errorMessage2: "Can't modify a executing/concluded job",
      });
    }
  } catch (error) {}
});

// POST "/owner/edit-job/:jobId" => edita job en DB
router.post("/edit-job/:jobId", async (req, res, next) => {
  const { pet, city, startDate, endDate, comment } = req.body;
  // console.log(req.session.user._id)

  try {
    let jobToEdit = await Job.findById(req.params.jobId);
    if (
      pet === null ||
      city === "" ||
      startDate === "" ||
      endDate === "" ||
      startDate >= endDate ||
      new Date(startDate) < new Date() ||
      new Date(endDate) < new Date()
    ) {
      const startDateForHTML = jobToEdit.startDate.toISOString().split("T")[0];
      const endDateForHTML = jobToEdit.endDate.toISOString().split("T")[0];

      let ownerPets = await Pet.find({
        owner: req.session.user._id,
      }).populate("owner");



    ownerPets = JSON.parse(JSON.stringify(ownerPets));
      jobToEdit = JSON.parse(JSON.stringify(jobToEdit));

      jobToEdit.pet.forEach((jobSelectedPet) => {
        ownerPets.forEach((eachPet) => {

          console.log(jobSelectedPet)
          if (jobSelectedPet === eachPet._id) {
            eachPet.isSelected = true;
          
          }
        });
      });









      res
        .status(400)
        .render("owner/jobedit.hbs", {
          jobToEdit,
          startDateForHTML,
          endDateForHTML,
          ownerPets,
          errorMessage:
            "pet, city and dates are fields required date can't be less than today, start date can't be greater than today",
        });
      return;
    }
    if (jobToEdit.status === "pending") {
      await Job.findByIdAndUpdate(req.params.jobId, {
        pet,
        city,
        startDate,
        endDate,
        comment,
      });
    }

    res.redirect("/owner/joblist");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
