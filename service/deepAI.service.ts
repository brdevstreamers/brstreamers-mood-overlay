import deepai from "deepai";
import { BotStorage } from "../chatScore";
import { DEEPAI_API_KEY } from "../config";
export class DeepAIService {
  static async generate(input: string) {
    deepai.setApiKey(DEEPAI_API_KEY);

    var resp = await deepai.callStandardApi("text2img", {
      text: input,
    });
    BotStorage.getInstance().setLatestImageURL(resp.output_url)
    return resp.output_url
  }
}
