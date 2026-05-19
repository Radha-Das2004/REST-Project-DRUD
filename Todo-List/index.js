const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

//  Method Override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//  id Unique
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));




let todos = [
    { 
        id : uuidv4(),
        task : "Understand Express.js routing",
        isCompleted : false,
    },
    { 
        id : uuidv4(),
        task : "Create Read route for Todo App",
        isCompleted : false, 
    },
    { 
        id : uuidv4(),
        task : "Implement forEach loop in EJS file",
        isCompleted : false,
    },
    { 
        id : uuidv4(),
        task : "Enhance UI design using CSS",
        isCompleted : false,
    }
];


// index main show all todo list
app.get("/todos", (req, res) => {
    res.render("index", { todos });
})


// Create new todo
app.get("/todos/new", (req, res) => {
    res.render("new.ejs"); // यह 'new.ejs' नाम का पेज रेंडर करेगा
});


// नए टास्क को लिस्ट में जोड़ने के लिए
app.post("/todos", (req, res) => {
    let { task } = req.body; // फॉर्म से 'task' का डेटा निकाला
    let id = uuidv4();       // नई यूनिक आईडी जनरेट की
    let isCompleted = false; // नया टास्क है, इसलिए शुरुआत में false रहेगा

    // अब इसे अपने मुख्य todos एरे में पुश कर दो
    todos.push({ id, task, isCompleted });

    // काम होने के बाद वापस मुख्य पेज पर भेज दो (Redirect)
    res.redirect("/todos");
});




// Update PATCH
app.patch("/todos/:id", (req, res) => {
    let { id } = req.params;
    let todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.isCompleted = true; // उसका स्टेटस बदलकर true कर दिया
    }
    res.redirect("/todos");
})

// 5. DELETE (Destroy)
app.delete("/todos/:id", (req, res) => {
    let { id } = req.params;
    todos = todos.filter((t) => t.id !== id); // आपका सबसे पसंदीदा फ़िल्टर लॉजिक
    res.redirect("/todos");
}); // यहाँ delete रूट बंद हुआ

// 🛑 यह लाइन सबसे ज़रूरी है, चेक करो यह आपके कोड में सबसे नीचे है या नहीं!
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});