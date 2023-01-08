const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const app = express();

require("./db");

app.disable("x-powered-by");
app.use(cors());
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoute");
const notesRoute = require("./routes/notesRoute");

app.use(userRoute);
app.use(notesRoute);

app.listen(3001, () => {});
