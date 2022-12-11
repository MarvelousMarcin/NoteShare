const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JTW_TOKEN;

const auth = (req, res, next) => {
  if (!req.body || !req.body.token) {
    return res.status(403).send({ error: "Auth needed" });
  }
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
  } catch (e) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = auth;
