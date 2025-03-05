import { playerDataType } from "@/lib/types";
import { Paralax } from "./paralax";
import { Player } from "./player";
import { Time } from "./time";

export class Main {
  public ctx: CanvasRenderingContext2D;

  public paralax: Paralax;

  public playerId: 0 | 1;
  public playerInitialX: number;
  public playerInitialY: number;
  public playerSize: number;
  public playerInitialActionId: number;
  public playerName: string;

  public player1: Player;
  public player2: Player | null;

  public ping = 0;

  public deadAnimationFinish = false;

  public time: Time;

  constructor(
    ctx: CanvasRenderingContext2D,
    playerId: 0 | 1,
    playerName: string,
    playerInitialActionId: number,
    playerInitialX: number,
    playerInitialY: number,
    playerSize: number
  ) {
    this.ctx = ctx;

    this.paralax = new Paralax(ctx);

    this.playerId = playerId;

    this.playerName = playerName;
    this.playerInitialActionId = playerInitialActionId;
    this.playerInitialX = playerInitialX;
    this.playerInitialY = playerInitialY;
    this.playerSize = playerSize;

    this.player1 = new Player(
      this,
      this.ctx,
      this.playerId,
      this.playerName,
      this.playerInitialActionId,
      false,
      this.playerInitialX,
      this.playerInitialY,
      this.playerSize
    );

    this.player2 = null;

    this.time = new Time(this);
  }

  private pingDraw() {
    let color;

    // ping level color
    if (this.ping >= 0 && this.ping <= 50) color = "#00FF00";
    else if (this.ping >= 51 && this.ping <= 100) color = "#FFD700";
    else if (this.ping >= 101 && this.ping <= 150) color = "#FFA500";
    else if (this.ping >= 151 && this.ping <= 250) color = "#FF0000";
    else if (this.ping >= 251) color = "#4B4B4B";

    // begin new Path
    this.ctx.beginPath();
    // text color
    this.ctx.fillStyle = color as string;
    // set font
    this.ctx.font = "25px CustomFont";
    // draw ping
    this.ctx.fillText(
      this.ping.toString() + " ms",
      110,
      this.ctx.canvas.height - 50
    );
    // start draw
    this.ctx.fill();
  }

  public updatePing(ping: number) {
    this.ping = ping;
  }

  public sendPayer1Data() {
    return {
      initialX: this.player1.x,
      initialY: this.player1.y,
      speedY: this.player1.speedY,
      size: this.player1.size,
      actionSpriteNumber: this.player1.actionSpriteNumber,
      playerContolKeys: this.player1.controls.keys,
      playerId: this.player1.playerId,
      playerActionId: this.player1.actionId,
      actionSpriteWidth: this.player1.actionSpriteWidth,
      actionSpriteHeight: this.player1.actionSpriteHeight,
      name: this.player1.name,
      life: this.player1.life,
    } satisfies playerDataType;
  }

  public player2DataUpdate(data: playerDataType) {
    if (!data) return;

    if (!this.player2) {
      // Création du deuxième joueur si absent
      this.player2 = new Player(
        this,
        this.ctx as CanvasRenderingContext2D,
        data.playerId,
        data.name,
        data.playerActionId,
        true,
        data.initialX,
        data.initialY,
        data.size
      );
    } else {
      // Mise à jour des commandes du joueur 2
      if (this.player2.life !== data.life) this.player2.life = data.life;

      this.player2.updateControlKey(data.playerContolKeys);

      if (this.player2.actionId !== data.playerActionId) return;

      if (this.player2.x !== data.initialX) this.player2.x = data.initialX;
      if (this.player2.y != data.initialY) this.player2.y = data.initialY;
    }
  }

  private ifCollision() {
    if (!this.player2) return;

    // detect collisio
    if (
      (this.player1.x + this.player1.actionSpriteWidth < this.player2.x ||
        this.player2.x + this.player2.actionSpriteWidth < this.player1.x) &&
      (this.player1.y + this.player1.actionSpriteHeight < this.player2.y ||
        this.player2.y + this.player2.actionSpriteHeight < this.player1.y)
    )
      return false;
    else return true;
  }

  private playersLifeGestion() {
    if (!this.player2) return;
    if (this.player1.life <= 0) this.player1.life = 0;

    if (
      this.player1.life > 0 &&
      [6, 7, 8, 9].includes(this.player2.actionId) &&
      this.ifCollision()
    )
      this.player1.life -= 0.2;
  }

  public matchOver() {
    if (this.time.time === 0) return true;
  }

  public ifWin() {
    if (!this.player2) return;

    if (this.player1.life > this.player2.life) return true;
    else return false;
  }

  public player1IsElemineted() {
    if (this.player1.life <= 0) return true;
  }

  public update() {
    this.paralax.update();

    this.player1.update();
    if (this.player2) this.player2.update();

    this.pingDraw();

    this.time.draw();

    this.playersLifeGestion();
  }
}
