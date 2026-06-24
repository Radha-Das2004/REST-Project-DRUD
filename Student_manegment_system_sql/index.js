const express = require('express');
const app= express();

// SQL

const mysql= require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'RadhaKrishna@2004',
    database:'student_man'
});


// VIEWs
const path = require('path');
app.set("views", path.join(__dirname,'/views'));
app.set("view engine", 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

//  uuid
const{ v4: uuidv4 } = require('uuid');

// Method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

//  SHOW Total STudent Of number
app.get('/', (req,res) => {
    let q=`SELECT count(*) FROM students`;
    try{
        connection.query(q, (err, result)=> {
            if(err) throw err;
            let count = result[0][`count(*)`];
            res.render("home.ejs", {count})
        })
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
});

// get all Student details Show
app.get('/student', (req,res) =>{
    let q = `SELECT * FROM students`;
    try{
        connection.query(q,(err, students) => {
            if (err) throw err;

            res.render('showStudent.ejs',{students});
        });
    }catch(err){
        res.send('Some error in DB');
    }
});

// Step 3 EDIt Username
app.get("/student/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM students WHERE id = '${ id }'`;
        try{
            connection.query(q, (err, result) => {
                if(err) throw err;

                    let student = result[0];
                    res.render("eidtStudent.ejs", { student });
            });
        }catch(err) {
            console.log(err);
            res.send("Some error in DB");
        }
});

app.patch("/student/:id", (req,res) =>{
    let { id } = req.params;
    let{ password : formPassword, name : formName , email : formEmail, phone  : formPhone , course : formCourse, status : formStatus} = req.body;

    let q = `SELECT * FROM students WHERE id = '${id}'`;

    try{
        connection.query(q, (err, result) =>{
            if(err) throw err;

            let student = result[0];

            if( formPassword !== student.password){
                return res.send("Incorrect Password");
            } else {

                let finalName = formName ? formName : student.name;
                let finalEmail = formEmail ? formEmail : student.email;
                let finalPhone = formPhone ? formPhone : student.phone;
                let finalCourse = formCourse ? formCourse : student.course;
                let finalStatus = formStatus ? formStatus : student.status;


               let q2 = `
                    UPDATE students 
                    SET 
                        name = '${finalName}', 
                        email = '${finalEmail}', 
                        phone = '${finalPhone}', 
                        course = '${finalCourse}', 
                        status = '${finalStatus}'
                    WHERE id = '${id}';
                `;
                  connection.query(q2, (err ,result) =>{
                        if (err) {
                                console.error("SQL Error 2:", err);
                                return res.send("Failed to update database.");
                            }
                            res.redirect("/student");
                  });
            
            }
        });
    }catch(err) {
        res.send("Some Error in DB");
    }
});


//  ADD NEW User
app.get("/student/newStudent", (req,res) => {
    res.render("newStudent.ejs");
});

app.post("/student" , (req, res) => {
    let { 
        password: newPassword, 
        name: newName, 
        email: newEmail, 
        phone: newPhone, 
        // enrollment_date: newEnrollmentDate, 
        date_of_birth: newDateOfBirth, 
        course: newCourse, 
        status: newStatus, 
        image: newImage 
    } = req.body;

    let id = uuidv4();

    let todayDate = new Date().toISOString().slice(0, 10);

    let finalImage = newImage ? newImage : "/uploads/default.jpg";

    let q = `INSERT INTO students (id, name, email, phone, date_of_birth, course,enrollment_date, status, password, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        // यहाँ ध्यान से देखो: (err, result) पास किया है
        connection.query(q, [id, newName, newEmail, newPhone, newDateOfBirth, newCourse, todayDate, newStatus, newPassword, finalImage], (err, result) => {
            if (err) {
                console.error("SQL Error:", err);
             
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send("Student already exists with this email or ID.");
                }
                return res.status(500).send("Database error while adding student");
            }
            res.redirect('/student');
        });
    } catch (err) {
        console.log("System Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// DELETE
app.get("/student/:id/delete", (req,res) => {
    let { id } = req.params;
     let q = `SELECT * FROM students WHERE id = '${ id }'`;
      try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let student = result[0];
            res.render("delete.ejs", { student });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
})


app.delete('/student/:id', (req, res) => {
    let { id } =req.params;
    let { password : deletepass} = req.body;
    let q = `SELECT * FROM students WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
      
      let student = result[0];
      if( deletepass !== student.password) {
          return res.send("Incorrect password ");
      }else{
        let q2 = `DELETE FROM students WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/student");
        });
      }
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});




app.listen(8080, () => {
    console.log('Example app listening on port 8080');
})

