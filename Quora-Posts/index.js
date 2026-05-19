
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//  Method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
});

let posts = [
    { 
        id : uuidv4(),
        username : "Radha_das",
        content : "Hare Krishna Hare Krishna Krishna Krishna Hare Hare ",
    },
    { 
        id : uuidv4(),
        username : "Krishna_das",
        content : " Hare Hare Rama Hare Rama Rama Rama Hare Hare",
    },
    { 
        id : uuidv4(),
        username : "Mhohan_das",
        content : "Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare",
    },

]

//  Index Main
app.get("/posts", (req, res) => {
    res.render("index", { posts });
})


// Create POST
app.get("/posts/new", (req, res) => {
    res.render("new");
})

app.post("/posts", (req, res) => {
    let { username, content } =req.body;
    let id = uuidv4();
    posts.push({ id,username, content });
    res.redirect("/posts");
})

// view Separate Post
app.get("/posts/:id", (req, res) => {
    let { id } =req.params;
    let post = posts.find((post) => post.id === id);
    // console.log(post);
        res.render("show", { post });
});

//  PATCH Update
app.patch("/posts/:id", (req, res) => {
    let { id } =req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content =newContent;
    res.redirect("/posts");
})


app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
})


// Delete Post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/posts");
})