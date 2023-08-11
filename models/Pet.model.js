const { Schema, model } = require("mongoose");

const petSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    animalType: {
        type: String,
        enum: ["Dog", "Cat"],
        required: true
    },
    race: {
        type: String,
    },
    size: {
        type: String,
        enum: ["Small", "Medium", "Big"],
        required: true
    },
    DateOfBirth: {
        type: Date,
    },
    Owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comment: String
});

const Pet = model("Pet", petSchema);
module.exports = Pet;
