const express = require("express");
const notesRoute = express.Router();
const db = require("../db");

const auth = require("./verifyToken");

notesRoute.post("/note", auth, (req, res) => {
  const { title, content } = req.body;

  const userEmail = req.user.email;

  db.run(`INSERT INTO NOTES (title, content, user) VALUES (?, ?, ?)`, [
    title,
    content,
    userEmail,
  ]);
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

module.exports = notesRoute;
