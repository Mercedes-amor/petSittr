const express = require("express");
const router = express.Router();
// const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");
//Función adaptar visibilidad fechas obtenidas por MongoDB para html
const dateFixer = require("../utils/jobDateFixer.js");
// Función manejo subida imágenes a través de cloudinary
const uploader = require("../middlewares/cloudinary.middlewares.js");

//      PET   //

// GET "/owner/petlist" => Enseñar vista de mascotas
router.get("/petlist", async (req, res, next) => {
  try {
    let allOwnerPets = await Pet.find({ owner: req.session.user._id });
    let allOwnerPetsDatesFix = JSON.parse(JSON.stringify(allOwnerPets));
    //Función para adaptar formato fechas para visualización en html
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
  //Subida foto por defecto si no se envía ningún archivo
  if (req.file === undefined) {
    petprofilePic =
      "https://img.freepik.com/vector-premium/icono-perro-gato-estilo-plano-ilustracion-vector-cabeza-animal-sobre-fondo-blanco-aislado_740527-4.jpg?w=996";
  } else {
    petprofilePic = req.file.path;
  }
  //Booleanos para comprobar campos a mostrar en hbs
  //Mejora a implementar:
  //Generar función externa reutilizable para esta comprobación a través de un objeto.

  let isDog = false;
  let isSmall = false;
  let isMedium = false;
  let isBig = false;
  if (animalType === "dog") {
    //console.log("DOGGY")
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
  //Comprobación de que campos obligatorios no queden vacíos
  //Reenviamos datos para que complete los campos
  if (name === "" || animalType === "" || size === "") {
    res.status(400).render("owner/addpet.hbs", {
      errorMessage: "name, animal Type, size are fields required",
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
//Al editar se visualizan los datos preseleccionados
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

// POST "/owner/edit-pet/:petId" => Edita mascota y guarda cambios DB
router.post(
  "/edit-pet/:petId",
  uploader.single("picture"),
  async (req, res, next) => {
    const { name, animalType, race, size, dateOfBirth, comment } = req.body;
    //Si el usuario no modifica la imagen se mantiene
    let petprofilePic = "";
    if (req.file === undefined) {
      // petprofilePic =
      //   "https://img.freepik.com/vector-premium/icono-perro-gato-estilo-plano-ilustracion-vector-cabeza-animal-sobre-fondo-blanco-aislado_740527-4.jpg?w=996";
    } else {
      petprofilePic = req.file.path;
    }
    let isDog = false;
    let isSmall = false;
    let isMedium = false;
    let isBig = false;
    if (animalType === "dog") {
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
    //Volvemos a hacer una llamada a Mongo para el caso de dejar vacios campos obligatorios
    //al editar, que se regenere la vista con los datos originales.
    const petToEdit = await Pet.findById(req.params.petId);

    // console.log(req.session.user._id)
    if (name === "" || animalType === "" || size === "") {
      res.status(400).render("owner/editpet.hbs", {
        petToEdit,
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
      //Dependiendo de si el usuario introduce o no una imagen nueva se actualiza o no
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
  const { pet, city, price, startDate, endDate, comment } = req.body;
  console.log(pet);

  try {
    //Comprobación que los campos obligatorios no estén vacíos
    //Comprobación fecha inicio no sea posterior a fecha finalización
    //Usamos función new Date() para:
    //-Comprobación que las fechas no sean anteriores al día actual

    if (
      pet === "" ||
      city === "" ||
      price === "" ||
      startDate === "" ||
      endDate === "" ||
      startDate >= endDate ||
      new Date(startDate) < new Date() ||
      new Date(endDate) < new Date()
    ) {
      const ownerPets = await Pet.find({ owner: req.session.user._id });
      res.status(400).render("owner/jobadd.hbs", {
        pet,
        city,
        price,
        startDate,
        endDate,
        comment,
        errorMessage:
          "pet, city, price and dates are fields are required. Dates can't be before today",
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
      price,
      comment,
    });
    res.redirect("/owner/joblist");
  } catch (error) {
    next(error);
  }
});

// GET "/owner/joblist" => Enseñar vista de jobs de este owner
router.get("/joblist", async (req, res, next) => {
  try {
    let ownerJobs = await Job.find({ owner: req.session.user._id })
      .sort({ status: -1 })
      .populate("pet sittr");
    //Usamos dateFixer para arreglar visualización fechas en html
    ownerJobs = dateFixer(ownerJobs);
    ownerJobs.forEach((eachJob) => {
      if (eachJob.status === "pending") {
        eachJob.isSelected = true;
      }
    });
    res.render("owner/joblist.hbs", {
      ownerJobs,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/owner/delete-job/:jobId" => Eliminar job, solo permitido para los de status pending
router.get("/delete-job/:jobId", async (req, res, next) => {
  try {
    const jobToDelete = await Job.findById(req.params.jobId);
    if (jobToDelete.status === "pending") {
      await Job.findByIdAndDelete(req.params.jobId);
      res.redirect("/owner/joblist");
    } else {
      let ownerJobs = await Job.find({
        owner: req.session.user._id,
      })
        .sort({ status: -1 })
        .populate("pet sittr");
      ownerJobs = dateFixer(ownerJobs);
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
      })
        .sort({ status: -1 })
        .populate("pet sittr");
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
  const { pet, city, price, startDate, endDate, comment } = req.body;
  // console.log(req.session.user._id)

  try {
    let jobToEdit = await Job.findById(req.params.jobId);
    if (
      pet === null ||
      city === "" ||
      price === "" ||
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
      //Recorremos los dos array para comprobar qué pets están en el job a modificar
      //para que salgan preseleccionados en la vista
      jobToEdit.pet.forEach((jobSelectedPet) => {
        ownerPets.forEach((eachPet) => {
          console.log(jobSelectedPet);
          if (jobSelectedPet === eachPet._id) {
            eachPet.isSelected = true;
          }
        });
      });

      res.status(400).render("owner/jobedit.hbs", {
        jobToEdit,
        startDateForHTML,
        endDateForHTML,
        ownerPets,
        errorMessage:
          "pet, city, price and dates are fields are required. Dates can't be before today",
      });
      return;
    }
    if (jobToEdit.status === "pending") {
      await Job.findByIdAndUpdate(req.params.jobId, {
        pet,
        city,
        price,
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
