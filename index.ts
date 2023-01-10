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

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});

// initialize the WebSocket server instance
// const wss = new WebSocketServer({ server });

// let timer: Timer;

// wss.on("connection", (ws: WebSocket) => {
//   console.log("Connected")
//   timer = setInterval(() => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       const response = {
//         score: BotStorage.getInstance().score,
//         message: BotStorage.getInstance().latestMessage,
//         background: BotStorage.getInstance().overlayBackground,
//       };
//       ws.send(JSON.stringify(response));
//     } else {
//       clearInterval(timer);
//     }
//   }, 1000); // ~ 256 Hz
// });

// wss.on('close', () => {
//   // clearTimeout(timerTimeout);
//   console.error('Websocket connection closed. Reconnecting in %f seconds ...', 3);
//   // setTimeout(() => connect(address, protocols, options), timeout * 1000);
// });

// // start our server
// server.listen(process.env.PORT || 5678, () => {
//   console.log(
//     `Server started on port ${(server.address() as AddressInfo).port} :)`
//   );
// });
