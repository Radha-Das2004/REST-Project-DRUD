const express = require('express');
const app = express();
const port = 3000;

// ही सर्वर को यह याद रखने में मदद करता है कि: 
const session = require('express-session');

// ejs-mate
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// views
const path= require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // एक्सप्रेस को आपके views फ़ोल्डर का सही रास्ता बताने के लिए

//  middlewares 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  middleware for serving static files
app.use(express.static('public'));

// middleware for  Admin , teacher and Student Management
// 1. पहले सेशन इनिशियलाइज करें (इसे ऊपर होना जरूरी है)
app.use(session({
    secret: 'radha_key_2004', 
    resave: false,
    saveUninitialized: false
}));

// 2. अब checkRole मिडिलवेयर लिखें (क्योंकि अब req.session उपलब्ध है)
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            return next(); 
        }
        res.status(403).send(`Access Denied! Only ${role} allowed.`);
    };
};

// 3. यह नया मिडिलवेयर जोड़ें (EJS टेम्पलेट में currentUser एरर को रोकने के लिए)
app.use((req, res, next) => {
    res.locals.currentUser = (req.session && req.session.user) ? req.session.user : null;
    next();
});

//  Mongoose connection
const mongoose = require('mongoose');
const Batch = require('./models/Batch');
const User = require('./models/User');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StackCampus');
}

app.get('/stackcampus', (req, res) => {
    res.render('index.ejs');
});

// Logout button
app.get('/stackcampus/logout', (req,res) => {
    req.session.destroy() ;

    res.redirect('/stackcampus');
});


// new Add data to the database
app.get('/stackcampus/register', async (req, res) => {
    res.render('register.ejs');
});

app.post('/stackcampus/register', async (req, res) => {
    const newData = new User(req.body.register);
    await newData.save();
    // res.redirect('/stackcampus');
    res.send('User registered successfully!');
});

// .................login route
app.get('/stackcampus/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/stackcampus/login', async (req, res) => {
    const { email, password } = req.body.login;
    const user = await User.findOne({ email: email, password: password });

    if (!user) {
            return res.send("गलत ईमेल या पासवर्ड! कृपया दोबारा जांचें।");
        }
    
    req.session.user = user;

    // रोल के हिसाब से सही डैशबोर्ड पर भेजें
    if (user.role === 'admin') {
        res.redirect('/stackcampus/admin');
    } else if (user.role === 'teacher') {
        res.redirect('/stackcampus/teacher');
    } else {
        res.redirect('/stackcampus/student');
    }
});

// -------------------------------------------------
// Admin Dashboard
app.get('/stackcampus/admin', checkRole('admin'), async (req, res) => {
   const teachers = await User.find({ role: 'teacher' });
   // Fetch all batches and populate teacher details
        const batches = await Batch.find({}).populate('teacher');

        const countTeachers = User.countDocuments({ role: 'teacher' });
        const countStudents = User.countDocuments({ role: 'student' });
        const countBatches = Batch.countDocuments({});
        
        res.render('users/admin/admin.ejs', { 
            adminName: req.session.user.name,
            teachers: teachers,
            batches: batches,
            countTeachers :  await countTeachers,
            countStudents :  await countStudents,
            countBatches :  await countBatches,
            title: 'StackCampus - Admin'
        });
});

// Crete Teacher
app.post('/stackcampus/admin/add-teacher', checkRole('admin'), async (req, res) => {
    const { name, email, password } = req.body.teacher;
    const newTeacher = new User({
        name: name,
        email: email,
        password: password,
        role: 'teacher'
    });
    await newTeacher.save();
    res.redirect('/stackcampus/admin');
});
   
//    Create a Batch
    app.post('/stackcampus/admin/create-batch', checkRole('admin'), async (req, res) => {
        const { batchName, totalSeats, teacherId , batchImage } = req.body.batch;
        const newBatch = new Batch({
            batchName: batchName,
            totalSeats: totalSeats,
            availableSeats: totalSeats, // Initially, all seats are available
            teacher: teacherId,          // Storing the ObjectId of the teacher
            batchImage: batchImage       // Storing the batch image URL
        });
        await newBatch.save();
        res.redirect('/stackcampus/admin');
    });


app.get('/stackcampus/admin/batch-students/:batchId', async(req,res) => {
    const batchId = req.params.batchId;

    const studentBatch = await Batch.findById(batchId).populate('studentsEnrolled');
    res.render('users/admin/view-students.ejs',{studentBatch});
});

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------




// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// Teacher Dashboard
app.get('/stackcampus/teacher', checkRole('teacher'),async (req, res) => {
       const teacher = req.session.user;
        const teacherId = teacher._id;

        // Step 2: सिर्फ वही बैचेस ढूंढें जहाँ teacher फ़ील्ड इस ID से मैच करे
        // .populate('teacher') की ज़रूरत नहीं है क्योंकि टीचर खुद लॉगिन है, लेकिन आप चाहें तो रख सकते हैं
        const myBatches = await Batch.find({ teacher: teacherId });

       // Step 3: teacher.ejs फ़ाइल को डेटा भेजें
        res.render('users/teachers/teacher', { teacher, myBatches, title: 'StackCampus - Teacher' });
});

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// Student Dashboard

// 1. मेन स्टूडेंट डैशबोर्ड (यहाँ सिर्फ 2 बड़े बटन होंगे)
app.get('/stackcampus/student', checkRole('student'), (req, res) => {
    res.render('users/students/student.ejs', { student: req.session.user , title: 'StackCampus - Student'}); 
    // नोट: अगर आपकी फाइल का नाम student.ejs है तो यहाँ 'users/students/student' लिखें
});

// 2. Available Batches का अलग पेज (यहाँ सिर्फ नए बैचेस दिखेंगे)
app.get('/stackcampus/student/available', checkRole('student'), async (req, res) => {
    try {
        const student = req.session.user;
        const allBatches = await Batch.find().populate('teacher');
        
        // वो बैचेस जिनमें छात्र इनरोल नहीं है
        const availableBatches = allBatches.filter(batch => !batch.studentsEnrolled.includes(student._id));
        
        res.render('users/students/available.ejs', { student, availableBatches });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// 3. My Batches का अलग पेज (यहाँ सिर्फ इनरोल किए हुए बैचेस दिखेंगे)
app.get('/stackcampus/student/mybatches', checkRole('student'), async (req, res) => {
    try {
        const student = req.session.user;
        const allBatches = await Batch.find().populate('teacher');
        
        // वो बैचेस जिनमें छात्र पहले से इनरोल है
        const enrolledBatches = allBatches.filter(batch => batch.studentsEnrolled.includes(student._id));
        
        res.render('users/students/mybatches.ejs', { student, enrolledBatches });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.post('/stackcampus/student/:studentId/enroll', checkRole('student'), async (req, res) => {
    try {
        const { batchId } = req.body; // फॉर्म के हिडन इनपुट से बैच आईडी आएगी
        const studentId = req.session.user._id;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).send("Batch not found!");
        }

        if (batch.studentsEnrolled.includes(studentId)) {
            return res.send("You are already enrolled in this batch!");
        }

        if (batch.availableSeats <= 0) {
            return res.send("Sorry, all seats for this batch are full!");
        }

        batch.studentsEnrolled.push(studentId);
        batch.availableSeats -= 1;
        await batch.save();

        // सफ़ल होने के बाद 'Available' वाले पेज पर ही वापस भेजें
        res.redirect('/stackcampus/student/available');
    } catch (err) {
        res.status(500).send("Server Error: " + err.message);
    }
});

// Delete Student Batch (Unenroll)
app.post('/stackcampus/student/:studentId/unenroll', checkRole('student'), async (req, res) => {
    try {
        const { batchId } = req.body;
        const studentId = req.session.user._id;

        // One-shot update: Removes student and increases seat automatically
        await Batch.findByIdAndUpdate(batchId, {
            $pull: { studentsEnrolled: studentId }, // Removes student ID from array
            $inc: { availableSeats: 1 }            // Increases availableSeats by 1
        });

        // Redirect straight back to My Batches page
        res.redirect('/stackcampus/student/mybatches');
    } catch (err) {
        res.status(500).send("Error while removing batch: " + err.message);
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});