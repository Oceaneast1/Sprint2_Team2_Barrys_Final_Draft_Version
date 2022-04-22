//Mongo Database Connection
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://BarryPoole:Hunter6%246%24@cluster0.3eskn.mongodb.net/test?authSource=admin&replicaSet=atlas-e6ut4g-shard-0&readPreference=primary&ssl=true";
const client = new MongoClient(uri);

//Express
const express = require ('express');
const app = express();

//Event Emitters and Log Events
const logEvents = require("../logEvents");
const EventEmitter = require("events");
class ThisEmitter extends EventEmitter {}
const thisEmitter = new ThisEmitter();

//Database Query's 
// Query By Family Name
async function getByFamilyName(name) {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The Family Name in Mongo you searched is " + name);
  app.set("view-engine", "ejs");
  console.log(`Found the families now`);
  await client.connect();
  const cursor = client
    .db("Census")
    .collection("census")
    .find({ family_name: name });
  const results = await cursor.toArray();
  console.log("Retuning Mongo fam Results");
  return results;
}

//Query By Province Name
async function getByProvince(province) {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The Province Name in Mongo you searched is " + province);
  app.set("view-engine", "ejs");
  console.log(`Found the families now`);
  await client.connect();
  const cursor = client
    .db("Census")
    .collection("census")
    .find({ province: province });
  const results = await cursor.toArray();
  console.log("Retuning Mongo fam Results");
  return results;
}

// Query By Census Year
async function getByCensusYear(census_year) {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The Census Year in Mongo you searched is " + census_year);
  app.set("view-engine", "ejs");
  console.log(`Found the Census Year stage-3`);
  await client.connect();
  const cursor = client
    .db("Census")
    .collection("census")
    .find({ census_year: census_year });
  const results = await cursor.toArray();
  console.log("I made it here results should be displayed")
  return results;
}
module.exports = {
  getByFamilyName,
  getByProvince,
  getByCensusYear,
  logEvents,
};