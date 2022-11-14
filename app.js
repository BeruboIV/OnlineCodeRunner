const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const { readFileSync } = require("fs");
const SSHClient = require("ssh2").Client;
require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3000;

const interactiveRoute = require("./routes/interactive.js");
const nonInteractiveRoute = require("./routes/non_interactive.js");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
const httpServer = createServer(app);

const io = new Server(httpServer, {
    /* options */
});

app.get("/", (req, res) => {
    // res.set("Content-Type", "text/html");
    return res.render("index.ejs", { code: "", output: "", input: "", mode: "Non-Interactive" });
});

// To serve xterm static files
app.get("/xterm.css", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/css" });
    const file = readFileSync(path.join(__dirname + "/node_modules/xterm/css/xterm.css"));
    return res.end(file);
});
app.get("/xterm.js", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    const file = readFileSync(path.join(__dirname + "/node_modules/xterm/lib/xterm.js"));
    return res.end(file);
});
app.get("/xterm-addon-fit.js", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    const file = readFileSync(path.join(__dirname + "/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js"));
    return res.end(file);
});

app.post("/", (req, res, next) => {
    req.url += req.body.mode;
    next();
});

app.use("/Interactive", interactiveRoute);
app.use("/Non-Interactive", nonInteractiveRoute);

io.on("connection", function (socket) {
    var conn = new SSHClient();
    conn.on("ready", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        conn.shell(function (err, stream) {
            if (err) return socket.emit("data", "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n");
            socket.on("data", function (data) {
                stream.write(data);
            });
            stream
                .on("data", function (d) {
                    socket.emit("data", d.toString("binary"));
                })
                .on("close", function () {
                    conn.end();
                });
        });
    })
        .on("keyboard-interactive", (name, instructions, instructionsLang, prompts, finish) => {
            finish([process.env.SSH_PASSWORD]);
        })
        .on("close", function () {
            socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
        })
        .on("error", function (err) {
            socket.emit("data", "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n");
        })

        .connect({
            host: process.env.SSH_HOST_ID,
            port: process.env.SSH_PORT,
            username: process.env.SSH_USERNAME,
            privateKey: readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
            passphrase: process.env.SSH_PASSPHRASE,
            tryKeyboard: true,
            debug: console.log,
        });
});

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
