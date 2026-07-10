const mongoose = require('mongoose');
const User = require('../models/User'); 
const Batch = require('../models/Batch'); 

// 1. डेटाबेस कनेक्शन
mongoose.connect('mongodb://127.0.0.1:27017/StackCampus')
    .then(() => console.log("✅ डेटाबेस कनेक्शन सफल!"))
    .catch(err => console.log("❌ DB कनेक्शन एरर:", err));

const seedAdditionalData = async () => {
    console.log("🔄 Only new bulk data adding started...");

    // ================== 5 NEW TEACHERS (पुराने नाम नहीं दोहराए गए) ==================
    const additionalTeachers = [
        { name: "Arjun Rao", email: "arjun@stack.com", password: "password123", role: "teacher", image: "https://media.licdn.com/dms/image/v2/D5603AQHWQ37XpTUBaA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1700840584240?e=2147483647&v=beta&t=uCDNMNjPhCXy7eX7F4YLTUGh7F_88rsXZP-KDlNJimk" },
        { name: "Meera Sharma", email: "meera@stack.com", password: "password123", role: "teacher", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_BQ0pn6hWibElBrUxP1v9CiHHEjeO-FWHZtmJmWNAuA5kzwXmCFjPXu08&s=10" },
        { name: "Sanjay Gupta", email: "sanjay@stack.com", password: "password123", role: "teacher", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCxw2CGcvpTlrrHwPhqgIutiMU0uNHsgsfwqs_BQ4uA&s=10" },
        { name: "Pooja Verma", email: "pooja@stack.com", password: "password123", role: "teacher", image: "https://media.licdn.com/dms/image/v2/D4D03AQF1TGq1VKPADQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1697127491104?e=2147483647&v=beta&t=FMhQYoApyB2SgfRUEfdBlsrJ7osG_F4JVrrQ-bVYF68" },
        { name: "Karan Malhotra", email: "karan@stack.com", password: "password123", role: "teacher", image: "https://axsmwioqmf3c.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/static.filmyfocus.com/wp-content/uploads/2024/07/Karan-Malhotra.png" }
    ];

    // ================== 30 NEW STUDENTS (कोई पुराना नाम repeat नहीं) ==================
    const additionalStudents = [
        { name: "Vikas Kumar", email: "vikas@stack.com", password: "password123", role: "student", image: "https://www.yuvakabaddi.com/_next/image?url=https%3A%2F%2Fstatic.yuvakabaddi.com%2Fyks-assets%2Fimages%2Fplayer-images%2F1224.png&w=640&q=75" },
        { name: "Ananya Reddy", email: "ananya@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D5603AQHOGl2nhiT3Ew/profile-displayphoto-scale_200_200/B56ZhgUFv5HkAc-/0/1753962538280?e=2147483647&v=beta&t=eFOvoIWJcUHCFPCzdFEFd0N3RUySrovL2SqyPyGOhw0" },
        { name: "Siddharth Jain", email: "siddharth@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM7PpWaWjxzIz8WBLtsX9skE6T2sclfAGnMtB8NQ72Lj4lSU1dtzK4BzQ&s=10" },
        { name: "Nisha Patel", email: "nisha@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D5603AQF2IE1qisn3kw/profile-displayphoto-shrink_200_200/B56ZYS_.u9H0AY-/0/1744075484516?e=2147483647&v=beta&t=f5TNftLUAuycpUYnO2bOl7Kd3yxlrQlseHKrmSyqVgk" },
        { name: "Rajesh Yadav", email: "rajesh@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNz2K2-LouBbr0SUyispreC1WZsaKy1yAlYV_atHkFCdf7vcRdW7a5yi2U&s=10" },
        { name: "Swati Sharma", email: "swati@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJUA7ns9J8YA-lPKtZoZ43mLQ5-2t_WeJlNWOM4aFDHC2f3iyaqX92WjI&s=10" },
        { name: "Mohit Singh", email: "mohit@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf3c83UW_M73FIqxIbRnyZq7bUBohlAv85Wu0dkEePXqKq7y8UNo_HD4M&s=10" },
        { name: "Kavita Joshi", email: "kavita@stack.com", password: "password123", role: "student", image: "https://pbs.twimg.com/media/GFs9hIHawAAqVbY.jpg" },
        { name: "Prateek Malhotra", email: "prateek@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQycS1RYKFfxvBlZ992OgH__XQVVdV4hK7zHMowSQ6pVOn1H0Up1V609tGw&s=10" },
        { name: "Simran Kaur", email: "simran@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg69r-cV3r343oE6FKQYTwTS2Lh6YOGhlheLAdZNYSx4RiS8MjutLMPdc&s=10" },

        { name: "Ayush Bansal", email: "ayush@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROax-057ns1ef2q6FjAkPXjD_gb7CkLiaOG1xJ1L3D3xpQd0Lf-SpCnqbA&s=10" },
        { name: "Neha Gupta", email: "neha2@stack.com", password: "password123", role: "student", image: "https://images.filmibeat.com/192x258/img/popcorn/profile_photos/neha-gupta-20230530172745-57568.jpg" },
        { name: "Rohan Das", email: "rohan@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D5603AQEQUMh4uHLOOQ/profile-displayphoto-scale_200_200/B56Z0bNbozG8AY-/0/1774278005243?e=2147483647&v=beta&t=UkloamJBrxaQ-8oEZlLMTL8coEe1Zmt4BYSw2MItz1w" },
        { name: "Tanisha Roy", email: "tanisha@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyku-VCljw2RbS8HWNECx-qoHeFU4jwDSoOVqE2w1XZWAxJv3_Lw7QZxc&s=10" },
        { name: "Varun Mehta", email: "varun@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/C5603AQGJrAiicEJugw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1649688213318?e=2147483647&v=beta&t=0BpsJGjLy9twYFJyHDnET9FGH5wUIbfX2xHkZh0l6qA" },
        { name: "Pallavi Sen", email: "pallavi@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkQ0NjTKoTgb4tWX-jdM6VQkRdHJAFx33u1KmpjkpjQw&s" },
        { name: "Harsh Pandey", email: "harsh@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ujSC-HX1T1IElFCP4h9ChN0vxsYGdDauf4CJw-U0Cw&s" },
        { name: "Ishita Saxena", email: "ishita@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D4D03AQHrzHCk4-sCXg/profile-displayphoto-scale_200_200/B4DZoU.govIkAY-/0/1761288524678?e=2147483647&v=beta&t=bqc8-o2dd_LRNmtdR2nPPJuBtetxVWMN_BW_8nR8aKo" },
        { name: "Aditya Thakur", email: "aditya@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTfdBIP4xab31TLrKF7R-Kxq9YOll6eroDOQ09SI6hwDwF98GujjV5I7E&s=10" },
        { name: "Muskan Khan", email: "muskan@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwdj7D7Mss1ZXjXa10d4nVBYZ9aDDKTgPxoFCwmG-zgmT1JWZ3G_K3fzQ&s=10" },

        { name: "Yash Sharma", email: "yash@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK1Xtm0IhZLZTUIs7hC_xFksKSR3Y8EAj7BOjYA709J_erhb3eT5d9Y9rn&s=10" },
        { name: "Divya Nair", email: "divya@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpL9mriqwYWB6rajFpjiPjMpA467G0AXrtAnKBe_215T3HgPxqEQhKMJYx&s=10" },
        { name: "Saurabh Tiwari", email: "saurabh@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTad4t6SkDYXMa6UfOZGWBpg60aNch1EOJfwYGX-gRL5N55AwM49MJWogA&s=10" },
        { name: "Anika Bose", email: "anika@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEBLf-m5vWGLtO9HZMvFm1aN7_EMLyI3Fv0idMZWRUr6efnr2n4kddgRUI&s=10" },
        { name: "Kunal Agarwal", email: "kunal@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMLJNH7olJVVI7iTexmh60Dztc7xAi7U1uQSjjvdo4aQ&s=10" },
        { name: "Ritu Pandey", email: "ritu@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzpobCeH7Bo91Wab5QTa6aBavySui1deNgKHXSjsH-Nna_qZEknx6Wgft&s=10" },
        { name: "Nikhil Rao", email: "nikhil@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D5603AQHGgQcslu1o1w/profile-displayphoto-scale_200_200/B56ZiaGpBzHkAc-/0/1754932089984?e=2147483647&v=beta&t=E090YXq8-EidIODqgqsS-34ruXLJ4fAsou6F1gg0FAI" },
        { name: "Shalini Menon", email: "shalini@stack.com", password: "password123", role: "student", image: "https://media.licdn.com/dms/image/v2/D5603AQEaEK91uAS2qg/profile-displayphoto-shrink_200_200/B56ZUyKUh4GUAY-/0/1740303334425?e=2147483647&v=beta&t=jLhYStZPTd9Ost1HpFI91qhAdJ6HDFDzexvalxmMkeo" },
        { name: "Gaurav Khanna", email: "gaurav@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcs1_qngNfSiRBuRFbLSUx0x1zBc7Kto64-Sq53S6TZw&s=10" },
        { name: "Preeti Sharma", email: "preeti@stack.com", password: "password123", role: "student", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9JCTyIc2WDabQxqRq_keNTidbnP6wS1c805b-CxKTwFaaaO-JBtH7OGGn&s=10" }
    ];

    // Insert new data
    const savedTeachers = await User.insertMany(additionalTeachers);
    const savedStudents = await User.insertMany(additionalStudents);

    console.log(`✅ ${savedTeachers.length} नए Teachers और ${savedStudents.length} नए Students ऐड हो गए`);

    // Get all students for batch assignment
    const allStudents = await User.find({ role: "student" });
    const allStudentIds = allStudents.map(s => s._id);

    const allTeachers = await User.find({ role: "teacher" });

    // ================== 10 NEW BATCHES ==================
    const additionalBatches = [
        { batchName: "Java Programming", totalSeats: 35, availableSeats: 28, teacher: allTeachers[0]._id, studentsEnrolled: allStudentIds.slice(0, 7), batchImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFhb_L2fY75uALqMC8G_S2y0k1eEqHI_xTgetvx775YbrgFC54fqTDnQk&s=10" },
        { batchName: "React.js Advanced", totalSeats: 30, availableSeats: 22, teacher: allTeachers[1]._id, studentsEnrolled: allStudentIds.slice(7, 14), batchImage: "https://media.geeksforgeeks.org/wp-content/uploads/20240516171457/Reactjs-complete-course-by-gfg-(1).webp" },
        { batchName: "Machine Learning", totalSeats: 40, availableSeats: 35, teacher: allTeachers[2]._id, studentsEnrolled: allStudentIds.slice(14, 20), batchImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRMneLK4dKe0SMZQoqPYIGOUQkF0yAPPMWtr2sx4kzsJg8D9mbDyP7n0z0&s=10" },
        { batchName: "AWS Cloud", totalSeats: 25, availableSeats: 18, teacher: allTeachers[3]._id, studentsEnrolled: allStudentIds.slice(20, 25), batchImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDUWd9SlRgIPgU7-7z1iAkLKcceaQrls2jojJ43pEZkRquIzzJUsE4t-U&s=10" },
        { batchName: "UI/UX Design", totalSeats: 28, availableSeats: 20, teacher: allTeachers[4]._id, studentsEnrolled: allStudentIds.slice(25, 30), batchImage: "https://view.subpage.app/app/company/C532b8873cc5442e2b1f2265b77a7d7dc/domain/MTiT0jFlGh/page/Ma9aQb2DGh/article/Mf8af4eaca3f9b166f045b71fe61100671698987694871/hero/M3a7968025eb1d23e85d85e2d960449b91699239359648.webp" },
        { batchName: "Cyber Security", totalSeats: 32, availableSeats: 26, teacher: allTeachers[0]._id, studentsEnrolled: allStudentIds.slice(3, 10), batchImage: "https://assets-us-01.kc-usercontent.com/fa776f1a-4d27-4a6b-ae1c-2ce928f9647d/474348d2-9290-4e89-b85f-03163b4332b1/Cyber-security_lock%20%26%20hand.jpg" },
        { batchName: "Node.js Backend", totalSeats: 30, availableSeats: 24, teacher: allTeachers[1]._id, studentsEnrolled: allStudentIds.slice(10, 18), batchImage: "https://binmile.com/wp-content/uploads/2021/09/top-reasons-why-popular-internet-platforms-embrace-node-js-as-a-backend-for-their-apps.jpg" },
        { batchName: "Digital Marketing", totalSeats: 45, availableSeats: 38, teacher: allTeachers[2]._id, studentsEnrolled: allStudentIds.slice(18, 25), batchImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHKaQIX7HA6ODCcXf7SMxQeFGfEiprFVQU1rVr1c_-ebz-oWRdaMZLxuc&s=10" },
        { batchName: "Docker & Kubernetes", totalSeats: 22, availableSeats: 15, teacher: allTeachers[3]._id, studentsEnrolled: allStudentIds.slice(25, 30), batchImage: "https://toxsl.com/blog/image/456?file=5309" },
        { batchName: "Flutter Mobile Dev", totalSeats: 35, availableSeats: 29, teacher: allTeachers[4]._id, studentsEnrolled: allStudentIds.slice(5, 15), batchImage: "https://technobrains.io/wp-content/uploads/2021/07/flutter-Featured-Blog-Image2.jpg" }
    ];

    await Batch.insertMany(additionalBatches);
    console.log("✅ 10 नई बैचेस भी ऐड हो गईं!");
    console.log("🎉 Bulk data addition पूरा हो गया!");
};

seedAdditionalData().then(() => {
    console.log("Script finished.");
    process.exit(0);
}).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});