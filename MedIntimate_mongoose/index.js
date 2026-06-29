const express = require('express');
const app = express();

// views
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

//  post
app.use(express.urlencoded({ extended  :true}));

// Patch and Delete
const methodOverride= require('method-override')
app.use(methodOverride('_method'));

// Mongoose start
const mongoose = require('mongoose');

const Staff = require('./models/staffs');
const Patient = require("./models/patients");

main()
    .then( () =>{
        console.log('Connection Successful');
    })
    .catch( err => { console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/MedIntimate');
}

// MongoDb End 

//  dashboard 
app.get("/medIntimate", async (req, res) => {
    
        // 2. डेटाबेस से काउंट लाने के लिए 'await' का इस्तेमाल करें
        let staffCount = await Staff.countDocuments({});
        let patientCount = await Patient.countDocuments({});

        // 3. दोनों को एक ही सिंगल ऑब्जेक्ट के अंदर पास करें
        res.render('dashboard.ejs', { staff: staffCount, patient: patientCount });
})

// Staffs 
app.get("/medIntimate/staffs", async (req,res) => {
    let staffs =  await Staff.find();
    res.render("staffs/showStaffs.ejs", { staffs });
});

   // New Create 
app.get("/medIntimate/staffs/new", (req,res) => {
    res.render("staffs/newStaff.ejs");
})

app.post('/medIntimate/staffs', (req,res) => {
   let { staffName, designation, phone, image } = req.body
    let newStaff = new Staff({
        staffName,       // 👈 सही वेरिएबल का नाम
         designation,   // 👈 सही वेरिएबल का नाम
          phone,               // 👈 सही वेरिएबल का नाम
          image,
    });
    
    newStaff.save()
            .catch(err => {err});
    
    res.redirect("/medIntimate/staffs");
});

    // Edit Staff 

app.get("/medIntimate/staffs/:id/edit" , async (req,res) => {
    let { id } =req.params;
    let staff =await Staff.findById(id);
    
    res.render("staffs/editStaff.ejs", {staff});
});

app.put('/medIntimate/staffs/:id' , async (req,res)=>{
    let { id } = req.params;
   let { staffName, designation, phone, image } = req.body;
    let updateStaff = await Staff.findByIdAndUpdate(
        id,
        { staffName, designation, phone, image },
        {runValidators : true, returnDocument: 'after'},
    );
    res.redirect('/medIntimate/staffs');
});

// Delete 
app.get("/medIntimate/staffs/:id/delete", async ( req,res) => {
    let { id } =req.params;
    let staff =await Staff.findById(id);
    res.render("staffs/deleteStaff.ejs", { staff });
});

app.delete("/medIntimate/staffs/:id", async (req,res) => {
    let { id } =req.params;
    let staff =await Staff.findById(id);
    if(req.body.deletePassword === staff.designation) {
        await Staff.findByIdAndDelete(id);
    }else{
        res.send("Wrong Password! Staff cannot be deleted.");
    };
    res.redirect("/medIntimate/staffs");
});

    //show id staff
app.get("/medIntimate/staffs/:id", async (req,res) => {
    let { id } =req.params;
    let staff =await Staff.findById(id);
    let patient = await  Patient.find({ assignedStaff: id });
    res.render("staffs/showSingleStaff.ejs", {staff, patient});
});

// Patients
app.get('/medIntimate/patients' , async (req,res) => {

    let patients = await Patient.find().populate("assignedStaff");
    res.render("patients/showPatients.ejs", { patients});
});

    //Edit patients
app.get("/medIntimate/patients/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        
        // 1. उस स्पेसिफिक मरीज़ का डेटा निकालें
        let patient = await Patient.findById(id);
        
        // 2. ड्रॉपडाउन में दिखाने के लिए सभी स्टाफ की लिस्ट निकालें
        let staffs = await Staff.find({});
        
        // 3. दोनों चीज़ों को एक साथ EJS पेज पर भेजें
        res.render("patients/editPatient.ejs", { patient, staffs });
        
    } catch (err) {
        res.status(404).send("Patient data not found.");
        console.log(err);
    }
});

app.put("/medIntimate/patients/:id",async (req,res) => {
    let { id } = req.params;
        let { patientName, reason, claimStatus, assignedStaff, image } = req.body;

        // अगर एडमिन ने कोई डॉक्टर सिलेक्ट नहीं किया, तो उसे null या empty स्ट्रिंग पास करेंगे
        let updatedData = {
            patientName,
            reason,
            claimStatus,
            assignedStaff: assignedStaff || null, // डॉक्टर बदला या हटाया जा सकता है
            image
        };

        // डेटाबेस में अपडेट करें
        await Patient.findByIdAndUpdate(id, updatedData, { runValidators: true });

       
        res.redirect("/medIntimate/patients");
})

// Delete 
app.get("/medIntimate/patients/:id/delete", async(req,res) =>{
    let { id } = req.params;
    let patient = await Patient.findById(id);
    res.render("patients/deletePatients.ejs", {patient})
   
})

app.delete("/medIntimate/patients/:id", async (req,res) =>{
    let { id } = req.params;
    let patient = await Patient.findById(id);
     if(req.body.patientDeletePassword === patient.reason) {
        await Patient.findByIdAndDelete(id);
    }else{
        res.send("Wrong Password! Patients cannot be deleted.");
    };
    res.redirect("/medIntimate/patients");
});

//  New Patients
app.get("/medIntimate/patients/new",async (req,res) => {
    let staffs = await Staff.find({});
     res.render("patients/newPatient.ejs", { staffs });
})
// 1. पाथ को '/medIntimate/patients' किया और फंक्शन के आगे 'async' जोड़ा
app.post('/medIntimate/patients', async (req, res) => {

        let { patientName, reason, claimStatus, assignedStaff, image } = req.body;
        
        let newPatient = new Patient({
            patientName,
            reason,
            claimStatus,
            assignedStaff: assignedStaff || null, 
            image
        });
        
        await newPatient.save();
        res.redirect("/medIntimate/patients");
});


app.listen(8080, () => {
    console.log("Server is Listening on port is 8080");
})