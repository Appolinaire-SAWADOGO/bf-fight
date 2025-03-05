import { Player } from "./player";

export class Controls {
  public keys: string;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
    this.keys = "";

    this.addeEvenlistener();
  }

  private addeEvenlistener() {
    if (this.player.opponent) return;

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        this.keys = e.key;
      } else if (e.key === "ArrowDown") {
        // this.player.controlsKey = e.key;
        this.keys = e.key;
      } else if (e.key === "ArrowLeft") {
        // this.player.controlsKey = e.key;
        this.keys = e.key;
      } else if (e.key === "ArrowRight") {
        // this.player.controlsKey = e.key;
        this.keys = e.key;
      } else if (e.key === "a") {
        // this.player.controlsKey = e.key;
        this.keys = e.key;
      } else if (e.key === "b") {
        // this.player.controlsKey = e.key;
        this.keys = e.key;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp") this.keys = "";
      else if (e.key === "ArrowDown") this.keys = "";
      else if (e.key === "ArrowLeft") this.keys = "";
      else if (e.key === "ArrowRight") this.keys = "";
      else if (e.key === "a") this.keys = "";
      else if (e.key === "b") this.keys = "";
    });
  }
}
