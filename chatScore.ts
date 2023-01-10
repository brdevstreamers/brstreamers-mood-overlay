export class BotStorage {
  private static instance: BotStorage;

  score: number = 0;
  scoreQueue: number[] = [];
  latestImageURL: string = "";

  latestMessage: string = "";
  regexp = /fla[0-9]{0,4}\w/gi;
  overlayBackground = "#000000";

  private constructor() {}

  public static getInstance(): BotStorage {
    if (!BotStorage.instance) {
      BotStorage.instance = new BotStorage();
    }

    return BotStorage.instance;
  }

  async calculateChatScore(new_score: number) {
    if (this.scoreQueue.length > 6) {
      this.scoreQueue.shift();
    }
    this.scoreQueue.push(new_score);
    let scoreSum = 0;
    this.scoreQueue.forEach((a) => (scoreSum += a));
    this.score = scoreSum / this.scoreQueue.length;
  }

  public setLatestMessage(message: string) {
    this.latestMessage = message;
  }

  public setOverlayBackground(background: string) {
    this.overlayBackground = background;
  }

  public setLatestImageURL(url: string) {
    this.latestImageURL = url;
  }
}
