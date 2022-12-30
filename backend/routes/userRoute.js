const express = require("express");
const userRouter = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const auth = require("./verifyToken");
var jwt = require("jsonwebtoken");
var validator = require("email-validator");

const checkPassword = (password) => {
  let entropy = 0;
  let size = password.length;

  for (let i = 0; i < 256; i++) {
    let prob = (password.split(String.fromCharCode(i)).length - 1) / size;
    if (prob > 0) {
      entropy += prob * Math.log2(prob);
    }
  }

  return -entropy;
};

userRouter.post("/user", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send({ error: "Wrong input" });
  }

  // Email Validate
  if (!validator.validate(email)) {
    return res.status(400).send({ error: "Wrong email" });
  }

  // Validate password
  if (checkPassword(password) < 3) {
    return res.status(400).send({ error: "Password too easy" });
  }

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
        "N",
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
      // If account is blocked
      if (row.blocked === "Y") {
        return res.status(400).send({ error: "Your account is blocked" });
      }

      // Check last login try time
      const time = new Date();

      if (time - row["last_login_try"] < 3000) {
        return res.status(400).send({ error: "Login to fast" });
      }

      if (bcrypt.compareSync(password, row.password)) {
        const token = jwt.sign(
          { name: row.name, email: row.email },
          process.env.JWT_TOKEN
        );

        db.run(`DELETE FROM LOGIN_TRY WHERE user='${email}'`);
        return res.status(200).send({ token });
      } else {
        db.run(`INSERT INTO LOGIN_TRY (user) VALUES (?)`, [email]);

        const currTime = new Date();

        db.run(
          "UPDATE USERS SET last_login_try = $currTime WHERE email = $email",
          {
            $currTime: currTime,
            $email: email,
          }
        );

        db.all(
          `SELECT * FROM LOGIN_TRY WHERE user='${email}'`,
          (error, rows) => {
            if (rows.length > 30) {
              db.run("UPDATE USERS SET blocked = 'Y' WHERE email= $email", {
                $email: email,
              });
              return res
                .status(400)
                .send({ error: "Too many tries, account blocked" });
            } else {
              return res.status(400).send({ error: "Wrong data" });
            }
          }
        );
      }
    } else {
      return res.status(400).send({ error: "Wrong data" });
    }
  });
});

module.exports = userRouter;
