const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const app = express();

const options = {
  key: fs.readFileSync("./client-key.pem"),
  cert: fs.readFileSync("./client-cert.pem"),
};

require("./db");

app.disable("x-powered-by");
app.use(cors());
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const userRoute = require("./routes/userRoute");
const notesRoute = require("./routes/notesRoute");

app.use(userRoute);
app.use(notesRoute);

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);
