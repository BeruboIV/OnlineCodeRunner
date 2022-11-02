const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const MAIN_FILE = "A.cpp";

router.post("/", (req, res) => {
    const { code } = req.body;
    console.log(code);
    try {
        fs.writeFileSync(MAIN_FILE, code);
    } catch (error) {
        console.log(error);
    }
    exec(`g++ -std=c++17 ${MAIN_FILE}; ./a.out`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.render("index.ejs", { code: code, output: error.message });
            // return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.render("index.ejs", { code: code, output: stderr });
        }

        console.log(`stdout:\n${stdout}`);
        return res.render("index.ejs", { code: code, output: stdout });
    });
});

module.exports = router;
