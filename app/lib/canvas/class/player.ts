import { actions, players } from "@/lib/utils";
import {
  Attack1Left,
  Attack1Right,
  Attack2Left,
  Attack2Right,
  DeadLeft,
  DeadRight,
  IdleLeft,
  IdleRight,
  jumpLeft,
  jumpRight,
  RunLeft,
  RunRight,
} from "./actions";
import { Controls } from "./controls";
import { Main } from "./main";
import { PlayerName } from "./player-name";
import { actionsType, actionType } from "@/lib/types";

export class Player {
  public x: number;
  public y: number;

  public initialX: number;
  public initialY: number;

  public size: number;

  public opponent: boolean;

  public actionSpriteNumber: number;
  public actionSpriteFrame = 0;
  public actionSpriteCount = 0;
  public actionSpriteCountMax = 4;

  public playerId: number;

  public actionImage = new Image();
  public actionSpriteWidth: number;
  public actionSpriteHeight: number;
  public actions: Array<object>;
  public actionId: number;
  public action: actionType;
  public actionSoundEffect = new Audio();

  public gravity = 0.2;
  public speedY = 0;

  public controls: Controls;

  public name: string;
  public life = 100;

  public playerNameAndLife: PlayerName;

  public main: Main;

  public ctx: CanvasRenderingContext2D;

  constructor(
    main: Main,
    ctx: CanvasRenderingContext2D,
    playerId: number,
    playerName: string,
    initialActionId: number,
    opponent: boolean,
    x: number,
    y: number,
    size: number
  ) {
    this.main = main;

    this.x = x;
    this.y = y;

    this.initialX = x;
    this.initialY = y;

    this.size = size;

    this.opponent = opponent;

    this.playerId = playerId;
    this.actionId = initialActionId;

    this.name = playerName;

    this.actions = [
      new IdleRight(this),
      new IdleLeft(this),
      new RunRight(this),
      new RunLeft(this),
      new jumpRight(this),
      new jumpLeft(this),
      new Attack1Right(this),
      new Attack1Left(this),
      new Attack2Right(this),
      new Attack2Left(this),
      new DeadRight(this),
      new DeadLeft(this),
    ];
    this.action = this.actions[this.actionId] as actionType;
    this.actionImage.src = this.action.spriteSrc;

    this.actionSpriteWidth = this.action.spriteWidth;
    this.actionSpriteHeight = this.action.spriteHeight;
    this.actionSpriteNumber = this.action.spriteNumber;
    this.actionSoundEffect.loop = false;

    this.playerNameAndLife = new PlayerName(this);

    this.controls = new Controls(this);

    this.ctx = ctx;
  }

  public draw() {
    this.ctx.drawImage(
      this.actionImage,
      this.actionSpriteWidth * this.actionSpriteFrame,
      0,
      this.actionSpriteWidth,
      this.actionSpriteHeight,
      this.x,
      this.y,
      this.actionSpriteWidth * this.size,
      this.actionSpriteHeight * this.size
    );

    this.playerNameAndLife.draw();
  }

  public initialPoisitionY() {
    return this.y <= this.initialY;
  }

  // play the action sound
  public soundEffect(actionName: actionsType) {
    this.actionSoundEffect.src = players[this.playerId][actions[actionName]]
      .soundSrc as string;

    this.actionSoundEffect.loop = false;

    this.actionSoundEffect.currentTime = 0;
    this.actionSoundEffect.play();
  }

  // réinitialise l’animation quand on change d’action a droite
  public resetRightSpriteAnimation(actionId: number) {
    this.actionSpriteCount = 0;
    this.actionSpriteFrame = 0;
    this.action = this.actions[actionId] as actionType;
  }

  // réinitialise l’animation quand on change d’action a gauche
  public resetLeftSpriteAnimation(actionId: number) {
    this.actionSpriteCount = 0;
    this.actionSpriteFrame = players[this.playerId][actionId].spriteNumber;
    this.action = this.actions[actionId] as actionType;
  }

  public speedYUpdate() {
    if (
      this.controls.keys === "ArrowUp" &&
      this.actionId != 4 &&
      this.actionId != 5
    )
      this.speedY = 8;
  }

  public updateControlKey(key: string) {
    this.controls.keys = key;
  }

  private deadActionAnimation() {
    if (this.life !== 0) return;
    if (
      this.action.actionName === "deadRight" ||
      this.action.actionName === "deadLeft"
    )
      return;

    if ([0, 2, 4, 6, 8, 10].includes(this.actionId))
      this.resetRightSpriteAnimation(actions.deadRight);
    else this.resetLeftSpriteAnimation(actions.deadLeft);
  }

  public update() {
    this.draw();

    this.speedYUpdate();

    this.action.update();

    this.deadActionAnimation();
  }
}
