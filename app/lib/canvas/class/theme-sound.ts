export class ThemeSound {
  public src: string;
  public themeSound = new Audio();

  constructor(src: string) {
    this.src = src;
    this.themeSound.src = src;
  }
  public play() {
    this.themeSound.loop = true;
    this.themeSound.currentTime = 0;
    this.themeSound.volume = 0.5;
    this.themeSound.play();
  }
}
