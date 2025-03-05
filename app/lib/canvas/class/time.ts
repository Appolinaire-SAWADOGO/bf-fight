import { Main } from "./main";

export class Time {
  public main: Main;
  public time = 90;

  public interval: NodeJS.Timeout;

  constructor(main: Main) {
    this.main = main;

    this.interval = setInterval(() => this.update(), 1000);
  }

  public draw = () => {
    if (!this.main || !this.main.ctx) {
      console.error("Erreur: this.main ou this.main.ctx est undefined");
      return;
    }

    this.main.ctx.fillStyle = "#ffffff";
    this.main.ctx.font = "150px CustomFont";
    this.main.ctx.fillText(
      this.time.toString(),
      this.main.ctx.canvas.width / 2 - 30,
      150
    );
  };

  public update = () => {
    if (this.time > 0 && this.time <= 90) this.time--;
    else if (this.time === 0) clearInterval(this.interval);
  };
}
