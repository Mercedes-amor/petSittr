//Función asíncrona que recorre todos los jobs y comprueba que el endDate sea posterior al día de hoy
//y en tal caso cambia el status a "conclude"
const express = require("express");
const Job = require("../models/Job.model.js");

async function concludedEndedJobs(req, res, next) {
  try {
    const currentDate = new Date();
    await Job.updateMany(
      {
        //Mejora de rendimiento a implementar, incluir condición para excluir de la búsqueda los jobs status="concluded"
        endDate: { $lt: currentDate },
      },
      { status: "concluded" }
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  concludedEndedJobs,
};
