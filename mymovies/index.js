const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// url 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// views 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// public
app.use(express.static(path.join(__dirname, "public")));

// UUID
const { v4: uuidv4 } = require('uuid');

// PATCH & DELETE  PAckage MEthod Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));



//    Connect to MySQL database start
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RadhaKrishna@2004',
  database: 'movies_trakers'
});


// data 
// let q = `INSERT INTO movies (id, title, genre, rating, image,password) VALUES ?`;

// let movies = [
//     { id: uuidv4(), title: "Naruto", genre: "Anime", rating: "5", image: "/movies/naruto.png", password: "password1" },
//     { id: uuidv4(), title: "Inception", genre: "Sci-Fi", rating: "4", image: "/movies/inception.png", password: "password2" },
//     { id: uuidv4(), title: "Demon Slayer", genre: "Sci-Fi", rating: "5", image: "/movies/spiderman.png", password: "password3" }
// ];


// let values = movies.map((movie) => [
//     movie.id, 
//     movie.title, 
//     movie.genre, 
//     movie.rating, 
//     movie.image,
//     movie.password
// ]);

// try {
//     connection.query(q, [values], (err, results) => {
//         if (err) throw err;
//         console.log("All movies inserted successfully!");
//         console.log(results);
//     });
// } catch(err) {
//     console.log(err);
// }


// Index main 

app.get('/movies/home', (req, res) => {
  let q = `SELECT count(*) FROM movies`;
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

app.get('/movies', (req, res) => {
  let q = `SELECT * FROM movies `;
  try {
  connection.query(q, (err, movies) => {
      if(err) throw err;
      
      res.render("index.ejs", { movies });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});



//  CREATE Movies
app.get("/movies/new", (req, res) => {
    res.render("new.ejs");
});


app.post("/movies", (req, res) => {
    let { password: newPass, title: newtitle, genre: newgenre, rating: newrating, image: newimage } = req.body;
    let id = uuidv4();
    
    // सुरक्षित तरीके से डेटा इंसर्ट करने के लिए '?' का उपयोग करें
    let q = `INSERT INTO movies (id, title, genre, rating, image, password) VALUES (?, ?, ?, ?, ?, ?)`;
    
    try {
        connection.query(q, [id, newtitle, newgenre, newrating, newimage, newPass], (err, result) => {
            if (err) {
                console.error("SQL Error:", err);
                // अगर ईमेल या आईडी पहले से मौजूद हो (Duplicate Entry)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send("Movies already exists with this email or ID.");
                }
                return res.status(500).send("Database error while adding user");
            }
            
            // डेटा सही से इंसर्ट होने के बाद सीधा ऑल यूजर्स पेज पर रीडायरेक्ट करें
            res.redirect("/movies");
        });
    } catch (err) {
        console.log("System Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

//  Get Id


app.get("/movies/:id", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM movies WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let movie = result[0];
            res.render("show.ejs", { movie });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
   
});


// PATCH  Update Movie


app.patch("/movies/:id", (req, res) => {
    let { id } = req.params;
    
    // req.body se direct variables nikal rahe hain bina unka naam badle
    let { password, title, genre, rating, image } = req.body;
    
    let q = `SELECT * FROM movies WHERE id = '${id}'`;

    connection.query(q, (err, result) => {
        if (err) {
            console.error("SELECT Error:", err);
            return res.status(500).send("Database error");
        }
        
        if (result.length === 0) {
            return res.status(404).send("Movie not found");
        }
        
        let movie = result[0];
        
        // Yahan 'password' (jo form se aaya) aur 'movie.password' (jo DB se aaya) ko compare kar rahe hain
        if (password !== movie.password) {
            return res.send("Incorrect password");
        } else {
            let q2 = `UPDATE movies SET title = '${title}', genre = '${genre}', rating = ${rating}, image = '${image}' WHERE id = '${id}'`;
            
            connection.query(q2, (err2, result2) => {
                if (err2) {
                    console.error("UPDATE Error:", err2);
                    return res.status(500).send("Database update error");
                }
                res.redirect("/movies");
            });
        }
    });
});

app.get("/movies/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM movies WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let movie = result[0];
            res.render("edit.ejs", { movie });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

// DELETE Movie



app.get("/movies/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM movies WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
     
            let movie = result[0];
            res.render("delete.ejs", { movie });
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

app.delete("/movies/:id", (req, res) => {
  let { id } = req.params;
    let { password } = req.body;
  let q = `SELECT * FROM movies WHERE id = '${ id }'`;
   try {
      connection.query(q,  (err, result) => {
      if(err) throw err;
      
      let movie = result[0];
      if( password !== movie.password) {
          return res.send("Incorrect password");
      }else{
        let q2 = `DELETE FROM movies  WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/movies");
        });
      }
    });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

