const express = require("express");
const notesRoute = express.Router();
const db = require("../db");
var CryptoJS = require("crypto-js");
var xss = require("xss");

const auth = require("./verifyToken");

const nullKeysInOutput = (rows) => {
  const newRows = rows.map((item) => {
    return { ...item, key: null };
  });

  return newRows;
};

notesRoute.post("/note", auth, (req, res) => {
  let { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send({ error: "Wrong input" });
  }

  const userEmail = req.user.email;

  // Protecting from xss

  title = xss(title);
  content = xss(content);

  db.run(
    `INSERT INTO NOTES (title, content, user, public, locked) VALUES (?, ?, ?, ?, ?)`,
    [title, content, userEmail, "N", "N"]
  );
  return res.status(200).send({});
});

notesRoute.post("/getnote", auth, (req, res) => {
  db.all(
    `SELECT * FROM NOTES WHERE user= ?`,
    [req.user.email],
    (error, rows) => {
      return res.json(nullKeysInOutput(rows));
    }
  );
});

notesRoute.post("/makepublic", auth, (req, res) => {
  let key = req.body.key;

  if (!key) {
    return res.status(400).send({ error: "Wrong input" });
  }

  // Protecting from xss

  key = xss(key);

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
    return res.json(nullKeysInOutput(rows));
  });
});

notesRoute.post("/share", auth, async (req, res) => {
  const note_id = req.body.note_id;
  const user_to = req.body.user_to;
  const user_from = req.user.email;

  if (!note_id || !user_to) {
    return res.status(400).send({ error: "Wrong input" });
  }

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

  db.all(`SELECT * FROM SHARES WHERE t= ?`, [req.user.email], (error, rows) => {
    if (rows) {
      rows.forEach((row) => {
        sharedToMe += `note_id='${row.note_id}' OR `;
      });
      sharedToMe += "1=0";
      db.all(`SELECT * FROM NOTES WHERE ${sharedToMe}`, (error, rows) => {
        if (rows) {
          return res.status(200).send(nullKeysInOutput(rows));
        }
      });
    } else {
      return res.status(400).send({ error: "No shared notes with you" });
    }
  });
});

notesRoute.delete("/note", auth, (req, res) => {
  const note_id = req?.body?.note_id;
  const user = req.user.email;

  if (!note_id) {
    return res.status(400).send({ error: "Wrong input" });
  }

  db.all(`SELECT * FROM NOTES WHERE note_id= ? `, [note_id], (error, rows) => {
    if (rows.length > 0) {
      if (rows[0].user !== user) {
        return res.status(400).send({ error: "No permission to this note" });
      } else {
        db.run(`DELETE FROM NOTES WHERE note_id= ? `, [note_id]);
        return res.status(200).send({});
      }
    } else {
      return res.status(400).send({ error: "Note doesn't exist" });
    }
  });
});

notesRoute.post("/secure", auth, (req, res) => {
  const note_id = req?.body?.note_id;
  const user = req.user.email;
  const password = req?.body?.key;

  if (!note_id || !password) {
    return res.status(400).send({ error: "Wrong input" });
  }

  db.all(`SELECT * FROM NOTES WHERE note_id= ? `, [note_id], (error, rows) => {
    if (rows.length > 0) {
      if (rows[0].user !== user) {
        return res.status(400).send({ error: "No permission to this note" });
      } else {
        if (rows[0].locked === "N") {
          var ciphertext = CryptoJS.AES.encrypt(
            rows[0].content,
            password
          ).toString();

          db.run(
            "UPDATE NOTES SET locked = 'Y', content = $content, key = $key WHERE note_id = $note_id",
            {
              $note_id: note_id,
              $content: ciphertext,
              $key: password,
            }
          );
          return res.status(200).send({ msg: "Encrypted" });
        } else {
          if (rows[0].key === password) {
            const decrypt = CryptoJS.AES.decrypt(rows[0].content, password);
            const originalText = decrypt.toString(CryptoJS.enc.Utf8);

            db.run(
              "UPDATE NOTES SET locked = 'N', content = $content, key = $key WHERE note_id = $note_id",
              {
                $note_id: note_id,
                $content: originalText,
                $key: null,
              }
            );

            return res.status(200).send({ msg: "Decrypted" });
          } else {
            return res.status(400).send({ error: "Bad password" });
          }
        }
      }
    } else {
      return res.status(400).send({ error: "Note doesn't exist" });
    }
  });
});

module.exports = notesRoute;
