//Express
const express = require("express");
const router = express.Router();

//Access to Public Folder
router.use(express.static("public"));

//Access to Data Access Layer
const censusDal = require("../services/census.dal");

router.get("/", (req, res) => {
  console.log("Here inside pg census! Stage 1");
  // this is what pulls up the dropdown for 3 choices
  res.render("pg_census.ejs");
});


module.exports = router;
