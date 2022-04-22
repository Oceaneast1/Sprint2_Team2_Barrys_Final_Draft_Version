//Express
const express = require("express");
const router = express.Router();

//Access to Public Access
router.use(express.static("public"));

const censusDal = require("../services/census.dal");

//Get Routers
router.get("/", (req, res) => {
  console.log("pg fam_search.js stage 1");
  // this is what pulls up the dropdown for 3 choices
  res.render("fam_search.ejs");
});

router.get("/search", async (req, res) => {
  console.log("outside pg search stage 2");
  var queryStr = require("url").parse(req.url, true).query;
  let allCensus = await censusDal.getCensusByFamilyName(queryStr.search);
  console.log(allCensus);
  if (allCensus.length === 0) {
    console.log("Inside the inside stage 3");
    res.render("norecord.ejs");
  } else {
    res.render("search.ejs", { allCensus });
  }
});





module.exports = router;
  


  