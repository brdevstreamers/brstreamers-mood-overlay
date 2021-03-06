import WebSocket from "ws";
import colors from "colors";
import { ChatScore } from "./chatScore";
import {
  CHANNELS_DEST,
  TWITCH_OAUTH_PASS,
  TWITCH_WEBSOCKET_URL,
  TWITCH_YOUR_USERNAME,
} from "./config";

export type CommandType = {
  client: WebSocket;
  channel: string;
  username: string;
};

type RulesType = Array<{
  test: (message: string) => boolean;
  function: (params: CommandType) => void;
}>;

// // ADD NEW COMMANDS HERE
// const RULES: RulesType = [
//   {
//     test: (message) => message.includes(""),
//     function:},
//   }
// ];

const onOpenConnection = (client: WebSocket) => {
  console.log(colors.green("Connected."));
  client.send(`PASS ${TWITCH_OAUTH_PASS}`);
  client.send(`NICK ${TWITCH_YOUR_USERNAME}`);
  console.log(colors.green("Authenticated."));

  CHANNELS_DEST.forEach((c) => {
    client.send(`JOIN #${c}`);
    console.log(colors.cyan(`Reading #${c}...`));
  });

  client.send("");
};

const onReceivedMessage = async ({
  data,
  client,
}: {
  client: WebSocket;
  data: WebSocket.RawData;
}) => {
  const MESSAGE_REGEX =
    /^:.+!.+@(?<username>[A-z0-9]+).tmi.twitch.tv (?<type>[A-Z]+) #(?<channel>[A-z0-9]+) :(?<message>.+)/;
  const match = MESSAGE_REGEX.exec(String(data));
  const {
    username = "",
    type = "",
    channel = "",
    message = "",
  } = match?.groups || {};

  if (!match) console.log(colors.gray(String(data)));
  if (message.length === 0) return;

  const line = `${colors.magenta(`[${type}]`)} ${colors.gray(
    `#${channel}`
  )} ${colors.green(`${username}:`)} ${colors.yellow(`${message}`)}`;
  console.log(line);

  analyze(message);
  processMessage(message);
};

const onClosedConnection = () => {
  console.log(colors.red("Closed"));
  console.log(colors.yellow("Restarting..."));
  startAnalyzer();
};

const startAnalyzer = () => {
  const client = new WebSocket(TWITCH_WEBSOCKET_URL);
  client.on("open", () => onOpenConnection(client));
  client.on("message", (data: any) => onReceivedMessage({ data, client }));
  client.on("close", onClosedConnection);
};

export default startAnalyzer;

async function analyze(message: string) {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Creates a client
  const client = new language.LanguageServiceClient();

  /**
   * TODO(developer): Uncomment the following line to run this code.
   */
  // const text = 'Your text to analyze, e.g. Hello, world!';

  // Prepares a document, representing the provided text
  const document = {
    content: message,
    type: "PLAIN_TEXT",
  };

  // Detects the sentiment of the document
  const [result] = await client.analyzeSentiment({ document });

  const sentiment = result.documentSentiment;

  ChatScore.getInstance().calculateChatScore(sentiment.score);


  console.log(ChatScore.getInstance().score);
}

const processMessage = (message:string) => {
  if(message.startsWith('!message ')) {
    ChatScore.getInstance().setLatestMessage(message.replace('!message ', ''));
  }
  if(message.startsWith('!background ')) {
    ChatScore.getInstance().setOverlayBackground(message.replace('!background ',''));
  }

}
