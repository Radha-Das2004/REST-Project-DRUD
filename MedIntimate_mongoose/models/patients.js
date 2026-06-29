const mongoose =require("mongoose");

const patientSchema =  new mongoose.Schema({
    patientName : {
         type: String,

    },
    reason : {
        type:String,
    },
    claimStatus : {
        type: String,
        default: "Intimation Sent",
        enum: ["Intimation Sent", "Under Review", "Approved"]
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
   },
   image : {
        type : String,
        required  :true
   }
})


module.exports = mongoose.model("Patient", patientSchema);