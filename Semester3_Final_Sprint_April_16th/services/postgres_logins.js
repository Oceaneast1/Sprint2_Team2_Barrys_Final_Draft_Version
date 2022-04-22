const dal = require("./postgres_db");


//Event Emitters and Log Events
const logEvents = require("../logEvents");
const EventEmitter = require("events");
class ThisEmitter extends EventEmitter {}
const thisEmitter = new ThisEmitter();

//Function Database Query's
async function getLogins() {
  
  let SQL = `SELECT * FROM public."Logins"`;
  try {
    let results = await dal.query(SQL, []);
    return results.rows;
  } catch (error) {
    console.log(error);
  }
}



async function getLoginByEmail(email) {
  thisEmitter.once("log", (msg) => logEvents(msg));
  thisEmitter.emit("log", " -- The last User Login signed in with this " + email);
  let SQL = `SELECT * FROM public."Logins" WHERE email = $1`;
  try {
    let results = await dal.query(SQL, [email]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function getLoginById(id) {
  
  let SQL = `SELECT * FROM public."Logins" WHERE id = $1`;
  try {
    let results = await dal.query(SQL, [id]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function addLogin(name, email, password, uuid) {
  
  let SQL = `INSERT INTO public."Logins"(name, email, password, uuid)
    VALUES ($1, $2, $3, $4) RETURNING id;`;
  try {
    let results = await dal.query(SQL, [name, email, password, uuid]);
    return results.rows[0].id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getLogins,
  addLogin,
  getLoginByEmail,
  getLoginById,
  
};