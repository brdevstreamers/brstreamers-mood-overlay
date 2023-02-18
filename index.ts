import startAnalyzer from "./bot";

import express from "express";
import Timer = NodeJS.Timer;
import * as WebSocket from "ws";

import { Router, Request, Response } from "express";
import { AddressInfo, WebSocketServer } from "ws";
import * as http from "http";
import { BotStorage } from "./chatScore";
import axios from "axios";
import cors = require("cors");

startAnalyzer();

const app = express();
app.use(cors());
// initialize a simple http server
const server = http.createServer(app);

app.get("/image", (req, res) => {
  res.send(BotStorage.getInstance().latestImageURL);
});

app.get("/question", (req, res) => {
  res.send(BotStorage.getInstance().latestQuestion);
});

app.get("/background", (req, res) => {
  res.send(BotStorage.getInstance().overlayBackground);
});

app.get("/message", (req, res) => {
  res.send(BotStorage.getInstance().latestMessage);
});

app.get("/tasks", (req, res) => {
  res.send(BotStorage.getInstance().tasks);
});

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});
