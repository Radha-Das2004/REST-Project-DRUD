const mongoose =require("mongoose");

const staffSchema = new mongoose.Schema({
    staffName : {
        type : String,
        required: true
    },
    designation : {
        type : String,
        required: true
    },
    phone : {
        type: Number,
        required: true
    },
    image : {
        type : String,
        required  :true
    }
});

module.exports = mongoose.model("Staff", staffSchema);