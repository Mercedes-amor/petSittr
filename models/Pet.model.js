const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    animalType: {
        type: String,
        enum: ["dog", "cat"],
        required: true
    },
    race: {
        type: String,
    },
    size: {
        type: String,
        enum: ["small", "medium", "big"],
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: String
});

const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;
