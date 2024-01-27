const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

const username = process.env.mongo_username;
const password = process.env.mongo_pass;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.otszvjo.mongodb.net/registrationFormDB`);



const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser= await Registration.findOne({email : email});
        if(!existingUser){
        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        console.log("User already exist");
        res.redirect("/error");
    }
    } catch (error) {
        console.error(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
