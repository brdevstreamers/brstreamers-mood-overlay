
import { Configuration, OpenAIApi } from "openai";
import { OPENAPI_KEY } from "../config";

export class ChatGPTService {
  static async generate(input: string) {
    const configuration = new Configuration({
      apiKey: OPENAPI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.6,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });

    return response.data.choices[0].text
  }
}
