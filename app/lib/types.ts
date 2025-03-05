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
} from "./canvas/class/actions";

export type actionsType =
  | "idleRight"
  | "idleLeft"
  | "runRight"
  | "runLeft"
  | "jumpRight"
  | "jumpLeft"
  | "attack1Right"
  | "attack1Left"
  | "attack2Right"
  | "attack2Left"
  | "deadRight"
  | "deadLeft";

export type actionType =
  | IdleRight
  | IdleLeft
  | RunRight
  | RunLeft
  | jumpRight
  | jumpLeft
  | Attack1Right
  | Attack1Left
  | Attack2Right
  | Attack2Left
  | DeadRight
  | DeadLeft;

export type playerType = Array<
  Array<{
    name: string;
    action: string;
    width: number;
    height: number;
    spriteNumber: number;
    soundSrc?: string;
    spriteSrc: string;
  }>
>;

export type playerEmplacementDataType = {
  playerInitialX: number;
  playerInitialY: number;
  initialActionId: number;
  playerSize: number;
};

export type playerDataType = {
  initialX: number;
  initialY: number;
  speedY: number;
  size: number;
  actionSpriteNumber: number;
  playerId: number;
  playerActionId: number;
  playerContolKeys: string;
  actionSpriteWidth: number;
  actionSpriteHeight: number;
  name: string;
  life: number;
} | null;
