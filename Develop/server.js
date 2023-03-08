const express = require('express');//importing
let dbData = require('./db/db.json');
const path = require('path');//importing build in module
const fs = require('fs')

const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const app = express();//calling the express method, create a server

//middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//GET route for retrieving all the titles and notes
app.get('/api/notes', (req, res) => {

    // Log  request to the terminal
    console.info(`${req.method} request received to notes`);

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})


//POST request
app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request received to add a review`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            text,
            title,
            id: uuidv4(),
        };


        dbData = readAndAppend(newNote, './db/db.json');
        res.json(dbData); // reassignment 
    } else {
        res.status(500).json('Error in posting note');
    }
})

//delete particular notes 
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    for (let i = 0; i < dbData.length; i++) {
        if (id === dbData[i].id) {
            dbData.splice(i, 1)
        }
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(dbData))//overwrite the file
    res.json(dbData)
})


//route to notes
app.get('/notes', (req, res) =>

    res.sendFile(path.join(__dirname, 'public/notes.html'))

);

//app.get('path),(req,res)
//route to homepage
app.get('*', (req, res) =>

    res.sendFile(path.join(__dirname, 'public/index.html'))

);


//run the server
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

