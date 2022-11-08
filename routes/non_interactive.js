const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const MAIN_FILE = "A.cpp";
const INPUT_FILE = "input.txt";

router.post("/", (req, res) => {
    const { code, input, mode } = req.body;
    try {
        fs.writeFileSync(MAIN_FILE, code);
        fs.writeFileSync(INPUT_FILE, input);
    } catch (error) {
        console.log(error);
    }
    exec(`g++ -std=c++17 ${MAIN_FILE}; ./a.out < ${INPUT_FILE}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.render("index.ejs", { code: code, output: error.message, input: input, mode: "Non-Interactive" });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.render("index.ejs", { code: code, output: stderr, input: input, mode: "Non-Interactive" });
        }
        console.log(`stdout:\n${stdout}`);
        return res.render("index.ejs", { code: code, output: stdout, input: input, mode: "Non-Interactive" });
    });
});

module.exports = router;
