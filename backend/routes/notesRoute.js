const express = require("express");
const notesRoute = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

const auth = require("./verifyToken");

notesRoute.post("/note", auth, (req, res) => {
  const { title, content } = req.body;

  const userEmail = req.user.email;

  db.run(
    `INSERT INTO NOTES (title, content, user, public, locked) VALUES (?, ?, ?, ?, ?)`,
    [title, content, userEmail, "N", "N"]
  );
  return res.status(200).send({});
});

notesRoute.post("/getnote", auth, (req, res) => {
  db.all(
    `SELECT * FROM NOTES WHERE user='${req.user.email}'`,
    (error, rows) => {
      return res.json(rows);
    }
  );
});

notesRoute.post("/makepublic", auth, (req, res) => {
  const key = req.body.key;

  db.all(`SELECT * FROM NOTES WHERE note_id='${key}'`, (error, row) => {
    if (row[0].public === "Y") {
      db.run("UPDATE NOTES SET public = 'N' WHERE note_id = $key", {
        $key: key,
      });
      return res.status(200).send({});
    } else {
      db.run("UPDATE NOTES SET public = 'Y' WHERE note_id = $key", {
        $key: key,
      });
      return res.status(200).send({});
    }
  });
});

notesRoute.post("/notepublic", auth, (req, res) => {
  db.all(`SELECT * FROM NOTES WHERE public='Y'`, (error, rows) => {
    return res.json(rows);
  });
});

notesRoute.post("/cipher", auth, (req, res) => {
  const id = req.body.id;
  const key = req.body.key;
});

module.exports = notesRoute;
