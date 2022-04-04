import startAnalyzer from "./bot";

import express from "express";
import Timer = NodeJS.Timer;
import * as WebSocket from "ws";

import { Router, Request, Response } from "express";
import { AddressInfo } from "ws";
import * as http from "http";
import { ChatScore } from "./chatScore";

startAnalyzer();

const app = express();

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let timer: Timer;

wss.on("connection", (ws: WebSocket) => {
 
  timer = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const score = ChatScore.getInstance().score;
      ws.send(score);
    } else {
      clearInterval(timer);
    }
  }, 4); // ~ 256 Hz
});

// start our server
server.listen(process.env.PORT || 5678, () => {
  console.log(
    `Server started on port ${(server.address() as AddressInfo).port} :)`
  );
});
