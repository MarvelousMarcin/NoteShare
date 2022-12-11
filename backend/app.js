const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const userRoute = require("./routes/userRoute");

app.use(userRoute);

app.get("/", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
