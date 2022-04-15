export class ChatScore {
  private static instance: ChatScore;

  score: number = 0;
  scoreQueue: number[] = [];

  latestMessage: string = "";
  regexp = /fla[0-9]{0,4}\w/gi; 
  overlayBackground = '#000000';

  private constructor() {}

  public static getInstance(): ChatScore {
    if (!ChatScore.instance) {
      ChatScore.instance = new ChatScore();
    }

    return ChatScore.instance;
  }

  async calculateChatScore(new_score: number) {
    if (this.scoreQueue.length > 6) {
      this.scoreQueue.shift();
    }
    this.scoreQueue.push(new_score);
    let scoreSum = 0;
    this.scoreQueue.forEach(a => scoreSum += a);
    this.score = scoreSum / this.scoreQueue.length;
  }


  public setLatestMessage(message: string) {
    this.latestMessage = message;
  }

  public setOverlayBackground(background: string) {
    this.overlayBackground = background;
  }
}
