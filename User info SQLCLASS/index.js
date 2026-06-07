const { faker } = require('@faker-js/faker');
const express = require('express');
const app = express();
const port = 3000;
//  EJs 
const path = require('path');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

//  Public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

//  uuid
const{ v4: uuidv4 } = require('uuid');

//    Connect to MySQL database start
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RadhaKrishna@2004',
  database: 'delta_app'
});

let getRandomUser = () => {
  return [
      faker.string.uuid(),
      faker.internet.username(),
      faker.internet.email(),
      faker.internet.password()
  ];
}
//    Connect to MySQL database End

// Fetch & show total number of users of users on our app

app.get('/', (req, res) => {
  let q = `SELECT count(*) FROM users`;
  try {
  connection.query(q, (err, results) => {
      if(err) throw err;
      let count =results[0]['count(*)'];
      res.render("home.ejs", { count });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});


// step 2  get all Users to SHOW
app.get('/user', (req, res) => {
  let q = `SELECT * FROM users ORDER BY created_at ASC`;
  try {
  connection.query(q, (err, users) => {
      if(err) throw err;
      
      res.render("showUsers.ejs", { users });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

//  Step 3 EDIT USERNAME 
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let user = result[0];
            res.render("editUsername.ejs", { user });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

// UPDATE USERNAME
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: fromUsername } = req.body;
  let q = `SELECT * FROM users WHERE id = '${ id }'`;

  try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
      
      let user = result[0];
      if( formPass !== user.password) {
          return res.send("Incorrect password");
      }else{
        let q2 = `UPDATE users SET username = '${fromUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});


//  NEW USER ADD
app.get("/user/new-user", (req, res) => {
   res.render("newUser.ejs");
});


// NEW USER ADD (ठीक किया हुआ कोड)
app.post("/user", (req, res) => {
    let { password: newPass, username: newUsername, email: newEmail } = req.body;
    let id = uuidv4();
    
    // सुरक्षित तरीके से डेटा इंसर्ट करने के लिए '?' का उपयोग करें
    let q = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
    
    try {
        connection.query(q, [id, newUsername, newEmail, newPass], (err, result) => {
            if (err) {
                console.error("SQL Error:", err);
                // अगर ईमेल या आईडी पहले से मौजूद हो (Duplicate Entry)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send("User already exists with this email or ID.");
                }
                return res.status(500).send("Database error while adding user");
            }
            
            // डेटा सही से इंसर्ट होने के बाद सीधा ऑल यूजर्स पेज पर रीडायरेक्ट करें
            res.redirect("/user");
        });
    } catch (err) {
        console.log("System Error:", err);
        res.status(500).send("Internal Server Error");
    }
});


// DELETE USER
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let user = result[0];
            res.render("deleteUser.ejs", { user });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
    let { password: deletePass, email: deleteEmail } = req.body;
  let q = `SELECT * FROM users WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
      
      let user = result[0];
      if( deletePass !== user.password || deleteEmail !== user.email) {
          return res.send("Incorrect password or email");
      }else{
        let q2 = `DELETE FROM users WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
