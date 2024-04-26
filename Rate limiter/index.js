const express = require("express");
const { hashSync, compareSync, genSaltSync } = require("bcrypt");
const { rateLimit } = require("express-rate-limit");

const app = express();
const limiter = rateLimit({ windowMs: 10000, limit: 3 });

app.get("/", (req, res) => {
  res.send("hello");
});

let dbpass = "";

app.get("/compare/:pas", (req, res) => {
  const { pas } = req.params;

  const isCorrect = compareSync(pas, dbpass);

  res.send({ isCorrect });
});

app.get("/secured/:pas", (req, res) => {
  const { pas } = req.params;

  const salt = genSaltSync(10);
  const hashedPass = hashSync(pas, salt);
  dbpass = hashedPass;
  res.json({ pass: hashedPass, salt });
});

//rate limited route
app.get("/login", limiter, (req, res) => {
  res.send({ success: true, info: req.ip });
});

app.listen(5000, () => {
  console.log("server running at port 5000");
});
