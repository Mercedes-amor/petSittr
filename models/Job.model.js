const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    sittr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    }],
    city: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending","executing", "concluded"],
        default: "pending"
    },
    comment: String
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;