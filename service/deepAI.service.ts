import deepai from "deepai";
import { Configuration, OpenAIApi } from "openai";
import { BotStorage } from "../chatScore";
import { DEEPAI_API_KEY, OPENAPI_KEY } from "../config";
export class DeepAIService {
  static async generate(input: string) {
    deepai.setApiKey(DEEPAI_API_KEY);
    // var resp = await deepai.callStandardApi("text2img", {
    //   text: input,
    // });
    const configuration = new Configuration({
      apiKey: OPENAPI_KEY,
    });

    const openai = new OpenAIApi(configuration);
    try {
      const response = await openai.createImage({
        prompt: input,
        n: 1,
        size: "1024x1024",
      });
      BotStorage.getInstance().setLatestImageURL(
        response.data.data[0].url || ""
      );
      return response.data.data[0].url;
    } catch (e) {
      return "OOpss.. algo deu errado."
      console.error(e);
    }
  }
}
