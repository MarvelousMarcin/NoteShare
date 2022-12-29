const express = require("express");
const userRouter = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const auth = require("./verifyToken");
var jwt = require("jsonwebtoken");

userRouter.post("/user", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send({ error: "Wrong input" });
  }

  // Validate password

  // Hash password

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Check if user exists
  db.all(`SELECT * FROM USERS WHERE email='${email}'`, (error, rows) => {
    if (error) {
      return res.status(400).send({ error });
    }

    if (rows.length < 1) {
      db.run("INSERT INTO USERS VALUES (?, ?, ?)", [
        email,
        hashedPassword,
        name,
      ]);
      return res.status(200).send({});
    } else {
      return res
        .status(400)
        .send({ error: "User with given email already exists" });
    }
  });
});

userRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM USERS WHERE email='${email}'`, (error, row) => {
    if (row) {
      if (bcrypt.compareSync(password, row.password)) {
        const token = jwt.sign(
          { name: row.name, email: row.email },
          process.env.JWT_TOKEN
        );

        return res.status(200).send({ token });
      } else {
        return res.status(400).send({ error: "Wrong data" });
      }
    } else {
      return res.status(400).send({ error: "Wrong data" });
    }
  });
});

module.exports = userRouter;
