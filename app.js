const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3000;

const nonInteractiveRoute = require("./routes/non_interactive.js");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

app.get("/", (req, res) => {
    return res.render("index.ejs", { code: "", output: "" });
});

app.use("/non_interactive", nonInteractiveRoute);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
