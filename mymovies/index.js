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

// data 
let movies = [
    { 
        id: uuidv4(), 
        title: "Naruto", 
        genre: "Anime", 
        rating: "5",
        image: "/movies/naruto.png"
    },
    { 
        id: uuidv4(), 
        title: "Inception", 
        genre: "Sci-Fi", 
        rating: "4",
        image: "/movies/inception.png"
    },
    { 
        id: uuidv4(), 
        title: "Demon Slayer", 
        genre: "Sci-Fi", 
        rating: "5",
        image: "/movies/spiderman.png"
    }
];

// Index main 
app.get("/movies", (req, res) => {
    res.render("index.ejs", { movies });
});


//  CREATE Movies
app.get("/movies/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/movies", (req, res) => {
    const { id, title, genre, rating, image } = req.body;
    const newMovie = {
        id: uuidv4(),
        title: title,
        genre: genre,
        rating: rating,
        image: image
    };
    movies.push(newMovie);
    res.redirect("/movies");
});

//  Get Id
app.get("/movies/:id", (req, res) => {
    let { id } = req.params;
    let movie = movies.find((m) => m.id === id);
    res.render("show.ejs", { movie });
});

// PATCH  Update Movie
app.patch("/movies/:id", (req, res) => {
    let { id } = req.params;
    let { title, genre, rating, image } = req.body;
    let movie = movies.find(m => m.id === id);
    if (movie) {
        if (movie) {
            // अगर नया इनपुट (title, genre आदि) सही है, तो वो सेट होगा, वरना पुराना वाला ही रहेगा
            movie.title = title.trim() || movie.title;
            movie.genre = genre.trim() || movie.genre;
            movie.rating = rating.trim() || movie.rating;
            movie.image = image.trim() || movie.image;
}
    }
    res.redirect("/movies");
});

app.get("/movies/:id/edit", (req, res) => {
    let { id } = req.params; // अब URL से सही ID मिलेगी
    let movie = movies.find(m => m.id === id);
    
    // सेफ्टी गार्ड: अगर किसी वजह से मूवी न मिले
    if (!movie) {
        return res.status(404).send("Movie not found for editing");
    }
    
    res.render("edit.ejs", { movie });
});

// DELETE Movie
app.delete("/movies/:id", (req, res) => {
    let { id } = req.params;
    movies = movies.filter(m => m.id !== id);
    res.redirect("/movies");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

