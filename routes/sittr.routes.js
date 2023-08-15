const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const Pet = require("../models/Pet.model.js");
const Job = require("../models/Job.model.js");

// GET "/sittr/joblist" => Enseñar vista de jobs
router.get("/joblist/", async (req, res, next) => {
  try {
    const jobsList = await Job.find({status:"pending"}).populate("pet");
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
  // console.log (animalType)
  if (animalType === undefined || city === ""|| startDate === ""|| endDate === "" || startDate >= endDate || new Date(startDate)< new Date()|| new Date(endDate)< new Date()) {
    const jobsList = await Job.find({status:"pending"}).populate("pet");
    res.status(400).render("sittr/joblist.hbs", {
      errorMessage: "city,animal Type and dates  are fields are required , start date can't be greater than end date, date can´tbe longer than today",
      jobsList,
    });
    return;
  }
  //  console.log (req.body)
  //  console.log(animalType)

  try {
    console.log(startDate)
    if (animalType.includes("dog") && animalType.includes("cat")) {
      const jobsList = await Job.find({ city,status:"pending", $and: [
        { startDate: { $gte: startDate } },
        { endDate: { $lte: endDate } },
      ] }).populate("pet");
      res.render("sittr/joblist.hbs", {
        jobsList,
      });
      console.log("both", jobsList[0].pet[0]);
    } else if (animalType.includes("dog")) {

      let jobsList = await Job.find({ city,status:"pending",$and: [
        { startDate: { $gte: startDate } },
        { endDate: { $lte: endDate } },
      ] }).populate("pet");
 

      const jobListClone = JSON.parse(JSON.stringify(jobsList));
      
      const onlyDogsJobList = jobListClone.filter((jobToFilter) => {
        let isThereAnyCat = false;
        for (const petIs of jobToFilter.pet) {
          if (petIs.animalType==="cat") {
            isThereAnyCat = true;
          }
        }
        if (isThereAnyCat) {
            return false
          } else {
            return true
          }
      });

      jobsList = JSON.parse(JSON.stringify(onlyDogsJobList));
      console.log(onlyDogsJobList);
      res.render("sittr/joblist.hbs", {
        jobsList,
      });

      //   console.log("doggy", jobsList)
    } else if (animalType.includes("cat")) {
      let jobsList = await Job.find({ city, status:"pending",$and: [
        { startDate: { $gte: startDate } },
        { endDate: { $lte: endDate } },
      ]}).populate("pet");
 
      const jobListClone = JSON.parse(JSON.stringify(jobsList));
      
      const onlyCatsJobList = jobListClone.filter((jobToFilter) => {
        let isThereAnyDog = false;
        for (const petIs of jobToFilter.pet) {
          if (petIs.animalType==="dog") {
            isThereAnyDog = true;
          }
        }
        if (isThereAnyDog) {
            return false
          } else {
            return true
          }
      });

      jobsList = JSON.parse(JSON.stringify(onlyCatsJobList));
      console.log(onlyCatsJobList);
      res.render("sittr/joblist.hbs", {
        jobsList,
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
    res.render("sittr/viewpet.hbs", {
      petToView,
    });
  } catch (error) {
    next(error);
  }
});


//GET "/sittr/accept-job/:jobId" => Cambia el status del job a executing

router.get("/accept-job/:jobId", async (req, res,nest) =>{

  try {
    await Job.findByIdAndUpdate(req.params.jobId, {
        status: "executing",
        sittr: req.session.user._id 
        })
    res.redirect("/sittr/joblist")
  } catch (error) {
    next(error);
  }

})


//GET "/sittr/job-list-accepted" 
router.get("/job-list-accepted", async (req,res,next) =>{

try {
  const jobsList = await Job.find({sittr: req.session.user._id })
  .populate("pet")
  res.render("sittr/joblistaccepted.hbs", {
    jobsList
  })
} catch (error) {
  next(error);
}

})





module.exports = router;
