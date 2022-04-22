if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//NPM Modules
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const uuid = require("uuid");
const logins = require("./services/postgres_logins"); 


const app = express();

//Routers
const censusRouter = require("./routes/pg_census");
const pgFamRouter = require("./routes/fam_search")
const provNameRouter = require("./routes/prov_search");
const yearRouter = require("./routes/pg_year_search");


const mongoRouter = require("./routes/mongo_fam_search");
const mongoCensusRouter = require("./routes/mongo_census");
const mongoProvRouter = require("./routes/mongo_prov");
const mongoYearRouter = require("./routes/mongo_year_search");


//Event Emitters and Logs
const logEvents = require("./logEvents");
const EventEmitter = require("events");
class ThisEmitter extends EventEmitter {}
const thisEmitter = new ThisEmitter();

//  add a listener for the log event
thisEmitter.on("log", (msg) => logEvents(msg));

// Emitting  the event
thisEmitter.emit("log", " -- A Log Event has been Emitted!");




// Login Passport
passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      let user = await logins.getLoginByEmail(email);
      if (user == null) {
        return done(null, false, { message: "No user with that email." });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Incorrect password was entered.",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await logins.getLoginById(id);
  done(null, user);
});

//Express
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());

//Secret Session Security
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Start Up
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  console.log("index check")
  res.render("index.ejs", { name: req.user.username });
});

//Call for Routers
app.use("/mongo_census", mongoCensusRouter);
app.use("/mongo_search", mongoRouter);
app.use("/mongo_prov", mongoProvRouter);
app.use("/mongo_year_search", mongoYearRouter);

app.use("/fam_search", pgFamRouter);
app.use("/pg_census", censusRouter);
app.use("/pg_year_search", yearRouter);
app.use("/prov_search", provNameRouter);


//Login Page Rendered
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Register Page Rendered
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let result = await logins.addLogin(
      req.body.name,
      req.body.email,
      hashedPassword,
      uuid.v4()
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("login");
});

//Auth Check
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}




app.use(express.static("public"));
app.listen(3000);