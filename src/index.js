require('dotenv').config();

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app = express(); 

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: ''
}));

//routes


app.listen(3000, () => console.log('UTN API service listening on port 3000!'))