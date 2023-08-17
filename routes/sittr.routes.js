const express = require("express");
const router = express.Router();

const dateFixer = require("../utils/jobDateFixer.js");
// const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");

// GET "/sittr/joblist" => Enseñar vista de jobs
router.get("/joblist/", async (req, res, next) => {
  try {
    let jobsList = await Job.find({ status: "pending" }).populate("pet");
    jobsList = dateFixer(jobsList);
    res.render("sittr/joblist.hbs", {
      jobsList,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/sittr/joblist" => Enseñar vista de jobs Filtrados
router.post("/joblist", async (req, res, next) => {
  const { city, animalType, startDate, endDate } = req.body;
  let isCat = false;
  let isDog = false;
  if (animalType !== undefined) {
    if (animalType.length === 2) {
      isCat = true;
      isDog = true;
    } else {
      if (animalType === "dog") {
        isDog = true;
      }
      if (animalType === "cat") {
        isCat = true;
      }
    }
  }
  // console.log (animalType)
  if (
    animalType === undefined ||
    city === "" ||
    startDate === "" ||
    endDate === "" ||
    startDate >= endDate ||
    new Date(startDate) < new Date() ||
    new Date(endDate) < new Date()
  ) {
    let jobsList = await Job.find({ status: "pending" }).populate("pet");
    jobsList = dateFixer(jobsList);
    res.status(400).render("sittr/joblist.hbs", {
      errorMessage:
        "pet, city and dates are fields are required. Dates can't be before today",
      jobsList,
      city,
      animalType,
      startDate,
      endDate,
      isDog,
      isCat,
    });
    return;
  }
  //  console.log (req.body)

  try {
    //Hacemos 3 filtros para separar entre las diferentes opciones: Dog/Cat/Dog&Cat
    if (animalType.includes("dog") && animalType.includes("cat")) {
      let jobsList = await Job.find({
        city,
        status: "pending",
        //Para aplicar el filtro como un rango entre las fechas inicio/fin indicadas
        $and: [
          { startDate: { $gte: startDate } },
          { endDate: { $lte: endDate } },
        ],
      }).populate("pet");
      jobsList = dateFixer(jobsList);
      res.render("sittr/joblist.hbs", {
        jobsList,
        city,
        animalType,
        startDate,
        endDate,
        isDog,
        isCat,
      });
      // console.log("both", jobsList[0].pet[0]);
    } else if (animalType.includes("dog")) {
      let jobsList = await Job.find({
        city,
        status: "pending",
        $and: [
          { startDate: { $gte: startDate } },
          { endDate: { $lte: endDate } },
        ],
      }).populate("pet");

      jobsList = JSON.parse(JSON.stringify(jobsList));
      //Al seleccionar la opción de dog, filtramos el array excluyendo todos los
      //jobs que tengan un cat
      const onlyDogsJobList = jobsList.filter((jobToFilter) => {
        let isThereAnyCat = false;
        for (const petIs of jobToFilter.pet) {
          if (petIs.animalType === "cat") {
            isThereAnyCat = true;
          }
        }
        if (isThereAnyCat) {
          return false;
        } else {
          return true;
        }
      });

      jobsList = JSON.parse(JSON.stringify(onlyDogsJobList));
      console.log(onlyDogsJobList);
      jobsList = dateFixer(jobsList);
      res.render("sittr/joblist.hbs", {
        jobsList,
        city,
        animalType,
        startDate,
        endDate,
        isDog,
        isCat,
      });

      //   console.log("doggy", jobsList)
    } else if (animalType.includes("cat")) {
      let jobsList = await Job.find({
        city,
        status: "pending",
        $and: [
          { startDate: { $gte: startDate } },
          { endDate: { $lte: endDate } },
        ],
      }).populate("pet");

      jobsList = JSON.parse(JSON.stringify(jobsList));
      //Al seleccionar la opción de cat, filtramos el array excluyendo todos los
      //jobs que tengan un dog
      const onlyCatsJobList = jobsList.filter((jobToFilter) => {
        let isThereAnyDog = false;
        for (const petIs of jobToFilter.pet) {
          if (petIs.animalType === "dog") {
            isThereAnyDog = true;
          }
        }
        if (isThereAnyDog) {
          return false;
        } else {
          return true;
        }
      });

      jobsList = JSON.parse(JSON.stringify(onlyCatsJobList));
      // console.log(onlyCatsJobList);
      jobsList = dateFixer(jobsList);
      res.render("sittr/joblist.hbs", {
        jobsList,
        city,
        animalType,
        startDate,
        endDate,
        isDog,
        isCat,
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET "/sittr/view-pet/:petId" => Enseñar vista de pets de un job
router.get("/view-pet/:petId", async (req, res, next) => {
  try {
    const petToView = await Pet.findById(req.params.petId);
    let dateOfBirthForHTML=""
    if (petToView.dateOfBirth !== null){
        dateOfBirthForHTML = petToView.dateOfBirth.toISOString().split("T")[0];  
    }

    res.render("sittr/viewpet.hbs", {
      petToView,
      dateOfBirthForHTML
    });
  } catch (error) {
    next(error);
  }
});

//GET "/sittr/accept-job/:jobId" => Cambia el status del job a executing

router.get("/accept-job/:jobId", async (req, res, nest) => {
  try {
    await Job.findByIdAndUpdate(req.params.jobId, {
      status: "executing",
      sittr: req.session.user._id,
    });
    res.redirect("/sittr/joblist");
  } catch (error) {
    next(error);
  }
});

//GET "/sittr/job-list-accepted"
router.get("/job-list-accepted", async (req, res, next) => {
  try {
    let jobsList = await Job.find({ sittr: req.session.user._id }).populate(
      "pet"
    );

    jobsList = dateFixer(jobsList);
    res.render("sittr/joblistaccepted.hbs", {
      jobsList,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
