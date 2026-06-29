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

// let staffData = [
//             { staffName: "Nitin Sharma", designation: "Doctor", phone: 9876543210, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt80Ld53GMZHacMoXkDpXhQhlez7cHkuLLzb-utfmUnQ&s=10" },
//             { staffName: "Yash Prakash Mitkari", designation: "Chief Surgeon", phone: 9876543211, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdcPrsM8Kn2NrKjKWPWqH_zueAynwIO43KKIGaJaBiqtFGXfzdyGVNtN4&s=10" },
//             { staffName: "Radha Kumari", designation: "Pediatrician", phone: 9876543212, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQStteoElkBD234khKMiXJvh9ZvJl4qKpHF7RP5uGU8tQ&s=10" },
//             { staffName: "Krishna Das", designation: "Orthopedic", phone: 9876543213, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJeNY3bY1PyOEJvCbg8J4P6jU9Ad184fCNpyPHqVc1QQ&s=10" },
//             { staffName: "Vishakha Patel", designation: "Senior Nurse", phone: 9876543214, image: "https://content.jdmagicbox.com/v2/comp/mumbai/t6/022pxx22.xx22.101024173638.h2t6/catalogue/dr-vishakha-p-joshi-joshi-nursing-home-mumbai-central-mumbai-gynaecologist-and-obstetrician-doctors-9e7juezcjy.jpg" },
//             { staffName: "Govind Joshi", designation: "Physiotherapist", phone: 9876543215, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGLOwGgRYaX6Ycz5Zklm-McG4aSQuVxnRUh0r_l2w9cw&s" },
//             { staffName: "Kailash Verma", designation: "Cardiologist", phone: 9876543216, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5Bm_pamb9AREOEmDzsAQJsEBHOaom4ZZe5LF7tnkUnMEgwYtbNKEfHps&s=10" },
//             { staffName: "Gopinathdas Brahmachari", designation: "Neurologist", phone: 9876543217, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQArhgjkO9sKI7HPOPT9DflLeaP9wPDGf-xUSKXyjn_9w&s=10" },
//             { staffName: "Lalita Devi", designation: "Dermatologist", phone: 9876543218, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4xuPW5rUZ4ZAit8BuhwlEvsOOv2d_uN99RWYxw05QA&s" },
//             { staffName: "Champaklata Dasi", designation: "Dietitian", phone: 9876543219, image: "https://assets.lybrate.com/img/documents/doctor/dp/9440e2052ce1b4a7b68f89897471fb34/Dietitian-Nutritionist-BhumikaBajaj-Mumbai-315763.jpg" }
//         ];


// Staff.insertMany(staffData)
//      .then(res => {console.log(res)})
//     .catch(err => {console.log(err)});


let  patientData = [
            // Assigned to Nitin Sharma
            { patientName: "Sandesh Patil", reason: "Viral Fever", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1a5" ,image :"https://www.goindigo.in/content/dam/s6web/in/en/assets/aiff/meet-the-players/Sandesh_Jhingan.png" },
            { patientName: "Mohan Lal", reason: "Diabetes", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1a5" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIkOlM8U_9sSRKlV78Q5Ef_wvbds-ZCM6vAlWFtd5JQzj1lAj3QVIVqIyc&s=10"},
            
            // Assigned to Yash Prakash Mitkari
            { patientName: "Sudevi Dasi", reason: "Appendix Operation", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1a6" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoVRIqfAqJfps67ChToxTUVzEdBWvu4jMFZM7DihwfPA&s=10"},
            { patientName: "Indulekha Mitra", reason: "Fracture", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1a6",image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgaEFqew-NO2R0vmaZrU_qEEOP1QGGSlwYIFOp6PdWgX4TtUl99mzlo2lY&s=10" },
            
            // Assigned to Radha Kumari
            { patientName: "Tungvidya Mishra", reason: "Childhood Asthma", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1a7" ,image :"https://images.stocklens.co.in/ias-images/uttar-pradesh/01UP120V06.jpg?v=2"},
            { patientName: "Harivansh Rai", reason: "Vaccination", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1a7" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6keuLIxmeso-KcgXUDjKpTQotDCu4_jIrLX7c-Cf52g&s=10"},
            
            // Assigned to Krishna Das
            { patientName: "Chitra Sen", reason: "Knee Replacement", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1a8",image :"https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/users/1662885895i/16400906._UX200_CR0,33,200,200_.jpg" },
            { patientName: "Jagannatha Das", reason: "Back Pain", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1a8" ,image :"https://upload.wikimedia.org/wikipedia/commons/e/ea/Jagannath_Prasad_Das.jpg"},
            
            // Assigned to Vishakha Patel
            { patientName: "Heet Privadini", reason: "Routine Checkup", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1a9" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyMuMvgB2Xv9u9ZPZziorCpVfuxYgLUlp5b_gjx05Jg&s"},
            { patientName: "Heet RadhaDahi", reason: "Blood Test", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1a9",image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA9reAWP522IpaqWG7Izd9mxdaTo87o8dFRBFERB9G2D4rgEJwMeqmlXE&s=10" },
            
            // Assigned to Govind Joshi
            { patientName: "Rangdevi Dasi", reason: "Physical Therapy", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1aa" ,image :"https://i1.sndcdn.com/avatars-000008493538-klefo5-t240x240.jpg"},
            { patientName: "Madhav Kumar", reason: "Muscle Tear", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1aa" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDf7RVu0Zamtlgko79uVeOP2Nwr7xN1UZdEe6udzELpMqHV_x77xIBRFc&s=10"},
            
            // Assigned to Kailash Verma
            { patientName: "Sanatan Goswami", reason: "ECG Test", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1ab",image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCYgV8O3KHyoGpBRU16uuHrD_F3MDmiFcwBF-AUIc8OewhZ29_VB_8Novd&s=10" },
            { patientName: "Narottam Das", reason: "High Blood Pressure", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1ab" ,image :"https://i.pinimg.com/474x/f7/e5/77/f7e5778e1c156100cb8fb20263c5de6a.jpg"},
            
            // Assigned to Gopinathdas Brahmachari
            { patientName: "Rupa Manjari", reason: "Migraine", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1ac" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTVYQSAv0m3mGRFOJj3gDTUec-JyWOwuAbICQ34feUbesCPKwxEzPRB9L_&s=10"},
            { patientName: "Jiva Goswami", reason: "Nerve Pain", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1ac" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf361MTCWL2txpuSblABzT3lneaZE5vSqnxg026V3ZEQFfqeH8QC0VKGk&s=10"},
            
            // Assigned to Lalita Devi
            { patientName: "Gopal Yadav", reason: "Skin Allergy", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1ad" ,image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Bi4e0m4J_7dQsqv4JM_Pha2BV3y8ceoHzetXajMqOA&s=10"},
            { patientName: "Suresh Bongane", reason: "Acne Treatment", claimStatus: "Approved", assignedStaff: "6a3cdab96747b076f309a1ad" ,image :"https://upload.wikimedia.org/wikipedia/commons/7/77/Dr_Suresh_mane.png"},
            
            // Assigned to Champaklata Dasi
            { patientName: "Balram Das", reason: "Diet Plan", claimStatus: "Intimation Sent", assignedStaff: "6a3cdab96747b076f309a1ae" ,image :"https://upload.wikimedia.org/wikipedia/commons/4/47/Balram_Tandon_%28cropped%29.jpg"},
            { patientName: "Subhadra Kumari", reason: "Weight Management", claimStatus: "Under Review", assignedStaff: "6a3cdab96747b076f309a1ae",image :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgE-DJUhtI2Eq_nh9KibQCKQEa2M16w23hNl813U0pZr8XCWah0FpWS_lc&s=10" }
        ];

 Patient.insertMany(patientData)
     .then(res => {console.log(res)})
    .catch(err => {console.log(err)});