
//Express
const express = require("express");
const router = express.Router();

//Access to Public Folder
router.use(express.static("public"));

const censusDal = require("../services/mongo_search.dal");

//Get Router
router.get("/", async (req, res) => {
  console.log("inside the page of mongo census")
  res.render("mongo_census.ejs");
});



module.exports = router;