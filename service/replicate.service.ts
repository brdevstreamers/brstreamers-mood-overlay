import axios from "axios";
import deepai from "deepai";
import { Configuration, OpenAIApi } from "openai";
import { BotStorage } from "../chatScore";
import { REPLICATE_KEY } from "../config";
export class ReplicateService {
  static async generate(input: string) {
    const data = {
      version:
        "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",
      input: { prompt: input },
    };

    const headers = {headers: {
      Authorization: `Token ${REPLICATE_KEY}`,
      "Content-Type": "application/json",
    }};
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      data,
      headers
    );

    if (response.status !== 201) {
      let error = await response.data();
      return JSON.stringify({ detail: error.detail });
    }

    const prediction = await response.data();
    return prediction;
  }
}
