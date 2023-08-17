//Función para cambiar el formato de fechas que establece MongoDB por defecto para
//poder una visualización más amigable en html

function dateFixer(jobsToFixDates) {
  let cloneJobsToFixDates = JSON.parse(JSON.stringify(jobsToFixDates));
  //Recorremos todos los jobs y con el split recortamos la cadena final del String
  cloneJobsToFixDates.forEach((job) => {
    const formatedStartDate = new Date(job.startDate);
    job.startDate = formatedStartDate.toISOString().split("T")[0];
    const formatedEndDate = new Date(job.endDate);
    job.endDate = formatedEndDate.toISOString().split("T")[0];
  });

  return cloneJobsToFixDates;
}

module.exports = dateFixer;
