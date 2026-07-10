const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const batchSchema = new Schema({
   batchName: {
       type: String,
       required: true
   },
   totalSeats: {
         type: Number,
         required: true
   },
   availableSeats : {
        type: Number,
        required: true
   },
   teacher : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
   },
   studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   }],
   batchImage : {
    type: String,
//     default: 'default.png',
//         set: (v) => v === '' ? 'default.png' : v
   }
});

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;