const express = require("express");
const app = express();
const { exec } = require("child_process");
const fs = require("fs");
require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3000;
const MAIN_FILE = "A.cpp";
const OUTPUT_FILE = "output.txt";

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { code: "", output: "" });
});

app.post("/", (req, res) => {
    // console.log(req.body);
    const { code } = req.body;
    try {
        fs.writeFileSync(MAIN_FILE, code);
    } catch (error) {
        console.log(error);
    }
    exec(`g++ -std=c++17 ${MAIN_FILE}; ./a.out > ${OUTPUT_FILE}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.render("index.ejs", { code: code, output: error.message });
            // return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.render("index.ejs", { code: code, output: stderr });
        }

        // console.log(`stdout:\n${stdout}`);
        const output = fs.readFileSync(OUTPUT_FILE);
        res.render("index.ejs", { code: code, output: output });
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
