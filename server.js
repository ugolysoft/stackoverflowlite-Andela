import express from "express";
const app = express();
import router from "./router";
app.use(express.static("public"));
app.use("/", router);

module.exports = app;
