import dotenv from "dotenv";

dotenv.config();

/*
  TWITCH CONFIGS
*/
export const TWITCH_OAUTH_PASS = process.env.TWITCH_OAUTH_PASS;
export const TWITCH_YOUR_USERNAME = process.env.TWITCH_YOUR_USERNAME;
export const TWITCH_WEBSOCKET_URL = "wss://irc-ws.chat.twitch.tv:443";

/*
  SPAM CONFIGS
*/
export const SPAM_MAX_MSG = 1;
export const SPAM_TIMEOUT_SECONDS = 10;
export const SPAM_CHECK_SECONDS = 5;

/*
  CHANNELS TO WATCH
*/
export const CHANNELS_DEST: Array<string> = ["flaviojmendes"];

/*
  DEEP AI
*/
export const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY || "";

/* 
  CHAT GPT
*/
export const OPENAPI_KEY = process.env.OPENAPI_KEY || "";


/* 
  CHAT GPT
*/
export const REPLICATE_KEY = process.env.REPLICATE_KEY || "";
