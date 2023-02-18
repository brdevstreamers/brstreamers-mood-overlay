import WebSocket from "ws";
import { ApiClient } from "twitch";

import colors from "colors";
import { BotStorage } from "./chatScore";
import {
  CHANNELS_DEST,
  TWITCH_OAUTH_PASS,
  TWITCH_WEBSOCKET_URL,
  TWITCH_YOUR_USERNAME,
} from "./config";
import { DeepAIService } from "./service/deepAI.service";
import { ChatGPTService } from "./service/chatGPT.service";
import { ReplicateService } from "./service/replicate.service";
import { TaskService } from "./service/task.service";

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

  // analyze(message);
  processMessage(message, client, channel, username);
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

  BotStorage.getInstance().calculateChatScore(sentiment.score);

  console.log(BotStorage.getInstance().score);
}

const processMessage = (
  message: string,
  client: WebSocket,
  channel: string,
  username: string
) => {
  if (message.toLowerCase().startsWith("!background ")) {
    BotStorage.getInstance().setOverlayBackground(
      message.replace("!background ", "")
    );
  }

  if (message.toLowerCase().startsWith("!message ")) {
    BotStorage.getInstance().setLatestMessage(message.replace("!message ", ""));
  }

  if (message.toLowerCase().startsWith("!img ")) {
    (async function () {
      const responseURL = await DeepAIService.generate(
        message.replace("!img ", "")
      );
      client.send(
        `PRIVMSG #${channel} :@${username}, aqui está sua imagem: ${responseURL}`
      );
    })();
  }

  if (message.toLowerCase().startsWith("!ask ")) {
    if (message.replace("!ask ", "").length > 5) {
      (async function () {
        const response = await ChatGPTService.generate(
          message.replace("!ask ", "")
        );
        client.send(`PRIVMSG #${channel} :@${username}: ${response}`);
      })();
    } else {
      client.send(
        `PRIVMSG #${channel} :@${username}, me dê uma pergunta que lhe dou uma resposta.`
      );
    }
  }

  if (
    message.toLowerCase().startsWith("!task ") ||
    message.toLowerCase().startsWith("!t ")
  ) {
    const task = message.replace("!task ", "").replace("!t ", "");
    if (task.length > 3) {
      (async function () {
        const response = await TaskService.setTask(username, task);
        client.send(`PRIVMSG #${channel} :@${username} começou ${task}`);
      })();
    }
  }

  if (
    message.toLowerCase().startsWith("!rtask") ||
    message.toLowerCase().startsWith("!rt")
  ) {
    (async function () {
      const task = await TaskService.removeTask(username);
      if (task) {
        client.send(`PRIVMSG #${channel} :@${username} terminou ${task}`);
      }
    })();
  }
};
