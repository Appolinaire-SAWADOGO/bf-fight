import { Player } from "./player";

export class PlayerName {
  public player: Player;
  public width: number;
  public height: number;

  constructor(player: Player) {
    this.player = player;
    this.width = 150;
    this.height = 8;
  }

  private drawBarBackground = () => {
    let plusX = 0;
    let plusY = 0;

    if ([1, 3, 5, 7, 9, 11].includes(this.player.actionId)) plusX = 45;
    if (this.player.playerId === 1) plusY = 80;

    this.player.ctx.fillStyle = "#000000";

    this.player.ctx.fillRect(
      this.player.x +
        (this.player.actionSpriteWidth * this.player.size) / 3 +
        plusX,
      this.player.y +
        (this.player.actionSpriteHeight * this.player.size) / 3 -
        plusY,
      this.width,
      this.height
    );
  };

  private drawProgressBar = () => {
    let plusX = 0;
    let plusY = 0;

    if ([1, 3, 5, 7, 9, 11].includes(this.player.actionId)) plusX = 45;
    if (this.player.playerId === 1) plusY = 80;

    this.player.ctx.fillStyle = "#FF0000"; // Couleur verte

    this.player.ctx.fillRect(
      this.player.x +
        (this.player.actionSpriteWidth * this.player.size) / 3 +
        plusX,
      this.player.y +
        (this.player.actionSpriteHeight * this.player.size) / 3 -
        plusY,
      (this.width * this.player.life) / 100,
      this.height
    );
  };

  private drawPlayerName = () => {
    let plusX = 0;
    let plusY = 20;

    if ([1, 3, 5, 7, 9, 11].includes(this.player.actionId)) plusX = 45;
    if (this.player.playerId === 1) plusY = 100;

    this.player.ctx.fillStyle = "#ffffff";
    this.player.ctx.font = "20px CustomFont";

    this.player.ctx.fillText(
      this.player.name,
      this.player.x +
        (this.player.actionSpriteWidth * this.player.size) / 3 +
        plusX,
      this.player.y +
        (this.player.actionSpriteHeight * this.player.size) / 3 -
        plusY
    );
  };

  public draw() {
    // Dessiner le fond de la barre
    this.drawBarBackground();

    // Dessiner la barre de progression
    this.drawProgressBar();

    // le nom du joueur
    this.drawPlayerName();
  }
}
