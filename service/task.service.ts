import deepai from "deepai";
import { Configuration, OpenAIApi } from "openai";
import { BotStorage } from "../chatScore";
import { DEEPAI_API_KEY, OPENAPI_KEY } from "../config";
export class TaskService {

  static async setTask(user: string, task: string) {
        BotStorage.getInstance().setUserTask(
        user, task
      );  
  }

  static async removeTask(user: string) {
    return BotStorage.getInstance().removeUserTask(
    user
  );  
}


}
