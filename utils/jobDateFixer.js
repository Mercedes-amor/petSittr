

function dateFixer (jobsToFixDates) {
let cloneJobsToFixDates = JSON.parse(JSON.stringify(jobsToFixDates));
cloneJobsToFixDates.forEach((job) => {
 
    const formatedStartDate = new Date(job.startDate);
    job.startDate = formatedStartDate.toISOString().split("T")[0];
    const formatedEndDate = new Date(job.endDate);
    job.endDate = formatedEndDate.toISOString().split("T")[0];


});

return cloneJobsToFixDates;

}

module.exports = dateFixer;