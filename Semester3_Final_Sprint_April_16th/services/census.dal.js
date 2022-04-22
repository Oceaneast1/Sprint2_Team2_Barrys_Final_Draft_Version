//PG Database Connection
const dal = require("./postgres_db");

//Express
const express = require("express");
const app = express();


//Event Emitters and Log Events
const logEvents = require("../logEvents");
const EventEmitter = require("events");
class ThisEmitter extends EventEmitter {}
const thisEmitter = new ThisEmitter();

//Query's of Pg Database
//Query by All Census
const getAllCensus = () => {
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM census ORDER BY family_name ASC";
    dal.query(sql, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};


//Query By Family Name
const getCensusByFamilyName = (family_name) => {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The Family Name in PG you searched is " + family_name);
  console.log("Outside promise");
  return new Promise(function (resolve, reject) {
    app.set("view-engine", "ejs");
    console.log("Inside promise: Family name: " + family_name);
    const sql = "SELECT * FROM census WHERE family_name = $1";
    dal.query(sql, [family_name], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
        }
    });
  });
};

//Query by Province  Name
const getCensusByProvinceName = (province) => {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The Province Name in PG you searched is " + province);
  console.log("Outside promise");
  return new Promise(function (resolve, reject) {
    app.set("view-engine", "ejs");
    console.log("Inside promise: Province name: " + province);
    const sql = "SELECT * FROM census WHERE province = $1";
    dal.query(sql, [province], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

//Query By Census Year
const getCensusByYear = (census_year) => {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit('log', " -- The Census Year in PG you searched is " + census_year);
  
  console.log("Outside promise");
  return new Promise(function (resolve, reject) {
    app.set("view-engine", "ejs");
    console.log("Inside promise: Year: " + census_year);
    const sql = "SELECT * FROM census WHERE census_year = $1";
    dal.query(sql, [census_year], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};




module.exports = {
  getAllCensus,
  getCensusByFamilyName,
  getCensusByProvinceName,
  getCensusByYear,
  logEvents,
  
};