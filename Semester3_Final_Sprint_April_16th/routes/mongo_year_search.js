//Express
const express = require("express");
const router = express.Router();

//Access to Public Folder
router.use(express.static("public"));


const {  getByCensusYear } = require("../services/mongo_search.dal");


// Get Routers
router.get("/", async (req, res) => {
console.log("inside landing page of mongo Census Year search");
res.render("mongo_year_search.ejs");

});



router.get("/search", async (req, res) => {
console.log("Mongo Census Year Search");
const queryObject = require("url").parse(req.url, true).query;
const searchString = queryObject.search;
const searchInteger = parseInt(searchString);// to convert string to integer
console.log(searchInteger);
const results = await getByCensusYear(searchInteger);
console.log(JSON.stringify(results, null, 2));  //  to list the child object o page as JSON 
if (results.length === 0) {
    console.log("Inside the inside");
    res.render("mongoNoRecord.ejs");
  } else {
    res.render("mongo_year_results.ejs", { results });
  }

});



module.exports = router;