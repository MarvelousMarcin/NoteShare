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

notesRoute.post("/share", auth, async (req, res) => {
  const note_id = req.body.note_id;
  const user_to = req.body.user_to;
  const user_from = req.user.email;
  if (user_to === user_from) {
    return res.status(400).send({ error: "You cannot share note to yourself" });
  }

  db.all(`SELECT * FROM NOTES WHERE note_id='${note_id}'`, (error, rows) => {
    if (rows.length > 0) {
      if (rows[0].user !== user_from) {
        return res.status(400).send({ error: "No permission to this note" });
      } else {
        // Check if user_to exists
        db.all(
          `SELECT * FROM USERS WHERE email='${user_to}'`,
          (error, rows) => {
            if (rows.length > 0) {
              db.all(
                `SELECT * FROM SHARES WHERE fro='${user_from}' AND t='${user_to}' AND note_id='${note_id}'`,
                (error, rows) => {
                  if (rows.length > 0) {
                    return res.status(400).send({
                      error: "You already shared this note to this user",
                    });
                  } else {
                    db.run(
                      `INSERT INTO SHARES (fro, t, note_id) VALUES (?, ?, ?)`,
                      [user_from, user_to, note_id]
                    );
                    return res
                      .status(200)
                      .send({ error: "Successfully shared" });
                  }
                }
              );
            } else {
              return res
                .status(400)
                .send({ error: "User with given email doesn't exist" });
            }
          }
        );
      }
    } else {
      return res.status(400).send({ error: "Note doesn't exist" });
    }
  });
});

notesRoute.post("/getshared", auth, (req, res) => {
  let sharedToMe = "";

  db.all(`SELECT * FROM SHARES WHERE t='${req.user.email}'`, (error, rows) => {
    if (rows) {
      rows.forEach((row) => {
        sharedToMe += `note_id='${row.note_id}' OR `;
      });
      sharedToMe += "1=0";
      db.all(`SELECT * FROM NOTES WHERE ${sharedToMe}`, (error, rows) => {
        if (rows) {
          return res.status(200).send(rows);
        }
      });
    } else {
      return res.status(400).send({ error: "No shared notes with you" });
    }
  });
});

notesRoute.post("/cipher", auth, (req, res) => {
  const id = req.body.id;
  const key = req.body.key;
});

notesRoute.delete("/note", auth, (req, res) => {
  const note_id = req?.body?.note_id;
  const user = req.user.email;

  db.all(`SELECT * FROM NOTES WHERE note_id='${note_id}'`, (error, rows) => {
    if (rows.length > 0) {
      if (rows[0].user !== user) {
        return res.status(400).send({ error: "No permission to this note" });
      } else {
        db.run(`DELETE FROM NOTES WHERE note_id='${note_id}'`);
        return res.status(200).send({});
      }
    } else {
      return res.status(400).send({ error: "Note doesn't exist" });
    }
  });
});

module.exports = notesRoute;
