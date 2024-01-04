import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "myDB",
  })
  .then(() => console.log("Database connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

const users = [];

//using middlewares
app.use(express.static(path.join(path.resolve(), "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// 500 -> internal server error
// 400 -> Not found
// set up view engine
app.set("view engine", "ejs");

//middleware
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (token) {
    const decoded = jwt.verify(token, "abc");
    console.log(decoded);
    //req ke saath attach krdiya user ki info
    req.user = await User.findById(decoded.id);
    next();
  } else {
    res.redirect("/login");
  }
};

// app.get("/add", async (req, res) => {
//   try {
//     await Message.create({ name: "Zaid", email: "Sample@gmail.com" });
//     console.log("Data Added");
//   } catch (err) {
//     console.log(err.message);
//   }
//   res.send("Nice");
// });

app.get("/", isAuthenticated, (req, res, next) => {
  console.log(req.user);
  res.render("logout", { name: req.user.name });
  // const { token } = req.cookies;
  // if (token) {
  //   res.render("logout");
  // } else {
  //   res.render("login");
  // }
  //   res.send("Hi");
  //   res.sendStatus(404);
  //   res.json({
  //     message: "Success",
  //     products: [],
  //   });
  //   res.status(400).send("My choice");
  //   const file = fs.readFileSync("./index.html");
  //   console.log(path.resolve());
  //   const pathLocation = path.resolve();
  //   console.log(path.join(pathLocation, "./index.html"));
  //   res.sendFile(path.join(pathLocation, "./index.html"));
  //   res.sendFile("index");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    //client side pr message nhi kr skte only server
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  console.log("logout page");
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ id: user._id }, "abc");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.redirect("/login");
  }
  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password:hashedPassword,
  });

  console.log(user);
  const token = jwt.sign({ id: user._id }, "abc");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

// app.post("/contact", async (req, res) => {
//   //   console.log("Post Method");
//   //   console.log(req.body.name);
//   //   console.log(req.body.email);
//   const userData = { username: req.body.name, email: req.body.email };
//   console.log(userData);
//   try {
//     await Message.create({ name: userData.username, email: userData.email });
//     console.log("Data Added");
//     res.redirect("/success");
//   } catch (err) {
//     console.log(err.message);
//     res.status(404).send("Error");
//   }
//   //   res.render("success");
// });

// app.get("/users", (req, res) => {
//   res.json({
//     users,
//   });
// });

// app.get("/success", (req, res) => {
//   res.render("success");
// });

app.listen(5000, () => {
  console.log("Server running");
});

// // const http = require("http");
// // const gfName = require("./feature");
// import http from "http";
// // import gfName from "./feature.js";
// // import { gfName2, gfName3 } from "./feature.js";
// import * as myObj from "./feature.js";
// import fs from "fs";
// import path from "path";
// //asynchronous
// fs.readFile("./index.html", () => {
//   console.log("File Read");
// });
// // console.log(path.extname("/home/random/index.html"));
// // console.log(path.dirname().toString());
// const home = fs.readFileSync("./index.html");
// // console.log(home);
// console.log(myObj.default);
// console.log(myObj.generatePercent());
// // console.log(gfName2, gfName3);
// const server = http.createServer((req, res) => {
//   //   console.log("serverred");
//   //   console.log(req.url);
//   if (req.url == "/about") {
//     res.end(`<h1>About ${myObj.generatePercent()}</h1>`);
//   } else if (req.url == "/home") {
//     // fs.readFile("./index.html", (err, home) => {
//     //   console.log("File Read");
//     //   res.end(home);
//     // });
//     console.log(req.method);
//     res.end(home);
//   } else {
//     res.end("<h1>Noice</h1>");
//   }
// });

// server.listen(5000, () => {
//   console.log("Server running");
// });
