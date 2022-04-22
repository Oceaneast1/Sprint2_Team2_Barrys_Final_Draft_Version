//Express
const express = require("express");
const router = express.Router();

//Access to Public Folder
router.use(express.static("public"));

//Access to Data Access Layer
const censusDal = require("../services/census.dal");

// Get Routers
router.get("/", (req, res) => {
  console.log("Here we are now! At pg_year_search.js");
  // this is what pulls up the dropdown for 3 choices
  res.render("pg_year_search.ejs");
});

router.get("/pg_year_results", async (req, res) => {
  console.log("outside @ pg_year_search");
  var queryStr = require("url").parse(req.url, true).query;
  let allCensus = await censusDal.getCensusByYear(queryStr.search);
  console.log(allCensus);
  if (allCensus.length === 0) {
    console.log("Inside the inside of pg_year_search");
    res.render("norecord.ejs");
  } else {
    res.render("pg_year_results.ejs", { allCensus });
  }
});





module.exports = router;