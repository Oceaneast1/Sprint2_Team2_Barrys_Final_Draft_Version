
//Express
const express = require("express");
const router = express.Router();

//Access to Public Folder
router.use(express.static("public"));

//Access to Data Access Layer
const censusDal = require("../services/census.dal");

//Get Routers
router.get("/", (req, res) => {
  console.log(" we are @ prov_search ");
  // this is what pulls up the dropdown for 3 choices
  res.render("prov_search.ejs");
});

router.get("/prov_results", async (req, res) => {
  console.log("outside @ pg_prov_search");
  var queryStr = require("url").parse(req.url, true).query;
  let allCensus = await censusDal.getCensusByProvinceName(queryStr.search);
  console.log(allCensus);
  if (allCensus.length === 0) {
    console.log("Inside the inside @ prov_search");
    res.render("norecord.ejs");
  } else {
    res.render("prov_results.ejs", { allCensus });
  }
});





module.exports = router;