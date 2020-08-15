// ! Third Party libraries
const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// ! Own libraries
const modules = require("./modules.js");
const backend = require("./backend.js");
// * Variables contants
const port = process.env.PORT || 3000;
const app = express();
const authTokens = {};
var Datastore = require("nedb"),
    db = new Datastore({ filename: "database.db", autoload: true });

// ? To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ? AuthToken support
app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies["AuthToken"];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

app.engine(
    "hbs",
    exphbs({
        extname: ".hbs",
    })
);

app.set("view engine", "hbs");

// ? Requests handlers

app.get("/", function (req, res) {
    // res.send({msg:'hello'})
    res.render("pages/home");
});

app.get("/manager", (req, res) => {
    if (req.user) {
        res.render("pages/manager", { user: req.user[0] });
    } else {
        res.render("pages/login", {
            message: "Please login to continue",
            messageClass: "alert-danger",
        });
    }
});

app.post("/manager", (req, res) => {
    if (req.user) {
        const { description, password } = req.body;
        const user = req.user[0];
        console.log(user);
        backend.create_password(
            db,
            user,
            description,
            password,
            (err, docs) => {}
        );
    } else {
        res.render("pages/login", {
            message: "Please login to continue",
            messageClass: "alert-danger",
        });
    }
});

app.get("/login", function (req, res) {
    res.render("pages/login");
});

app.post("/login", function (req, res) {
    const { username, password } = req.body;
    const passwordHash = modules.getHashedPassword(password);
    backend.compare_user(db, username, passwordHash, (err, docs) => {
        if (err === "error") {
            res.render("pages/login", {
                message: "Invalid username or password",
                messageClass: "alert-danger",
            });
        } else {
            const authToken = modules.generateAuthToken();
            authTokens[authToken] = docs;
            res.cookie("AuthToken", authToken, {
                maxAge: 600000,
                httpOnly: true,
            });
            res.redirect("manager");
        }
    });
});

app.get("/register", function (req, res) {
    res.render("pages/register");
});

app.post("/register", function (req, res) {
    const { firstName, username, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
        backend.find_user(db, username, (err, docs) => {
            if (err == "not found") {
                const passwordhash = modules.getHashedPassword(
                    password.toString()
                );
                const name = modules.getFull_name(firstName);
                backend.insert_user(
                    db,
                    name,
                    username,
                    passwordhash,
                    (err, docs) => {
                        console.log(err);
                    }
                );
                res.render("pages/login", {
                    message: "Registration Complete. Please login to continue.",
                    messageClass: "alert-success",
                });
                return;
            } else {
                res.render("pages/register", {
                    message: "User already registered.",
                    messageClass: "alert-danger",
                });
                return;
            }
        });
    }
});

app.listen(port, () => {
    console.log("listening on port " + port);
    console.log("http://localhost:" + port);
});
