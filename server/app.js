const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { db } = require("./db");
dotenv.config();
const bodyParser = require("body-parser");
const Router = require("./routers/userdataroutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", Router);

// app.use(cors({ origin: "http://localhost:3000" }));
app.use("/Assets", express.static(path.join(__dirname, "Assets")));

// app.use('/', (req,res)=>{
//     res.send("Hello Server");
// });

app.get("*", (req, res, next) => {
  // If the request is for an API route, skip serving the React HTML file
  if (req.url.startsWith('/api')) {
    return next();
  }
  
  // Otherwise, serve the React HTML file
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
