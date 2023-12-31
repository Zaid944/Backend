import express from "express";
import path from "path";
const app = express();

const users = [];

//using middlewares
app.use(express.static(path.join(path.resolve(), "./public")));
app.use(express.urlencoded({ extended: true }));

// 500 -> internal server error
// 400 -> Not found
// set up view engine
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
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
  res.render("index", { name: "Zaid" });
  //   res.sendFile("index");
});

app.post("/contact", (req, res) => {
  //   console.log("Post Method");
  //   console.log(req.body.name);
  //   console.log(req.body.email);
  users.push({ username: req.body.name, email: req.body.email });
  res.redirect("/success");
  //   res.render("success");
});

app.get("/users", (req, res) => {
  res.json({
    users,
  });
});

app.get("/success", (req, res) => {
  res.render("success");
});

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
