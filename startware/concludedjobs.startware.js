const express = require("express");

const Job = require("../models/Job.model.js");

async function concludedEndedJobs(req, res, next) {
  try {
    const currentDate = new Date();
    await Job.updateMany(
      {
           endDate: { $lt: currentDate } ,
          
      },
      { status: "concluded" }
    );
  } catch (error) {
    next(error);
  }

}

module.exports = {
    concludedEndedJobs
  };