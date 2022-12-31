const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

require("./db");

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const userRoute = require("./routes/userRoute");
const notesRoute = require("./routes/notesRoute");

app.use(userRoute);
app.use(notesRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
