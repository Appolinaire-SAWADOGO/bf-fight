import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { playerEmplacementDataType, playerType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const characters = [
  {
    name: "magician",
    imageSrc: "/images/Idle 1.gif",
    width: 170,
    height: 170,
  },
  {
    name: "wizard",
    imageSrc: "/images/Idle 2.gif",
    width: 400,
    height: 400,
  },
];

export const actions = {
  idleRight: 0,
  idleLeft: 1,
  runRight: 2,
  runLeft: 3,
  jumpRight: 4,
  jumpLeft: 5,
  attack1Right: 6,
  attack1Left: 7,
  attack2Right: 8,
  attack2Left: 9,
  deadRight: 10,
  deadLeft: 11,
};

export const players: playerType = [
  [
    {
      name: "magician",
      action: "idleRight",
      width: 128,
      height: 128,
      spriteNumber: 7,
      spriteSrc: "/player/player 1/Idle right.png",
    },
    {
      name: "magician",
      action: "idleLeft",
      width: 128,
      height: 128,
      spriteNumber: 7,
      spriteSrc: "/player/player 1/Idle left.png",
    },
    {
      name: "magician",
      action: "runRight",
      width: 128,
      height: 128,
      spriteNumber: 7,
      spriteSrc: "/player/player 1/Run right.png",
    },
    {
      name: "magician",
      action: "runLeft",
      width: 128,
      height: 128,
      spriteNumber: 7,
      spriteSrc: "/player/player 1/Run left.png",
    },
    {
      name: "magician",
      action: "jumpRight",
      width: 128,
      height: 128,
      spriteNumber: 7,
      soundSrc: "/player/player 1/sound-effect/player-1-jump.mp3",
      spriteSrc: "/player/player 1/Jump right.png",
    },
    {
      name: "magician",
      action: "jumpLeft",
      width: 128,
      height: 128,
      spriteNumber: 7,
      soundSrc: "/player/player 1/sound-effect/player-1-jump.mp3",
      spriteSrc: "/player/player 1/Jump left.png",
    },
    {
      name: "magician",
      action: "attack1Right",
      width: 128,
      height: 128,
      spriteNumber: 6,
      soundSrc: "/player/player 1/sound-effect/player-1-attacK1.mp3",
      spriteSrc: "/player/player 1/Attack_1 right.png",
    },
    {
      name: "magician",
      action: "attack1Left",
      width: 128,
      height: 128,
      spriteNumber: 6,
      soundSrc: "/player/player 1/sound-effect/player-1-attacK1.mp3",
      spriteSrc: "/player/player 1/Attack_1 left.png",
    },
    {
      name: "magician",
      action: "attack2Right",
      width: 128,
      height: 128,
      spriteNumber: 8,
      soundSrc: "/player/player 1/sound-effect/player-1-attacK2.mp3.mp3",
      spriteSrc: "/player/player 1/Attack_2 right.png",
    },
    {
      name: "magician",
      action: "attack2Left",
      width: 128,
      height: 128,
      spriteNumber: 8,
      soundSrc: "/player/player 1/sound-effect/player-1-attacK2.mp3.mp3",
      spriteSrc: "/player/player 1/Attack_2 left.png",
    },
    {
      name: "magician",
      action: "deadRight",
      width: 128,
      height: 128,
      spriteNumber: 3,
      soundSrc: "/player/player 1/sound-effect/player-1-death.mp3",
      spriteSrc: "/player/player 1/Dead right.png",
    },
    {
      name: "magician",
      action: "deadLeft",
      width: 128,
      height: 128,
      spriteNumber: 3,
      soundSrc: "/player/player 1/sound-effect/player-1-death.mp3",
      spriteSrc: "/player/player 1/Dead left.png",
    },
  ],
  [
    {
      name: "wizard",
      action: "idleRight",
      width: 231,
      height: 190,
      spriteNumber: 5,
      spriteSrc: "/player/player 2/Idle right.png",
    },
    {
      name: "wizard",
      action: "idleLeft",
      width: 231,
      height: 190,
      spriteNumber: 5,
      spriteSrc: "/player/player 2/Idle left.png",
    },
    {
      name: "wizard",
      action: "runRight",
      width: 231,
      height: 190,
      spriteNumber: 5,
      spriteSrc: "/player/player 2/Run right.png",
    },
    {
      name: "wizard",
      action: "runLeft",
      width: 231,
      height: 190,
      spriteNumber: 5,
      spriteSrc: "/player/player 2/Run left.png",
    },
    {
      name: "wizard",
      action: "jumpRight",
      width: 231,
      height: 190,
      spriteNumber: 1,
      soundSrc: "/player/player 2/sound-effect/player2-jump.mp3",
      spriteSrc: "/player/player 2/Jump right.png",
    },
    {
      name: "wizard",
      action: "jumpLeft",
      width: 231,
      height: 190,
      spriteNumber: 1,
      soundSrc: "/player/player 2/sound-effect/player2-jump.mp3",
      spriteSrc: "/player/player 2/Jump left.png",
    },
    {
      name: "wizard",
      action: "attack1Right",
      width: 231,
      height: 190,
      spriteNumber: 7,
      soundSrc: "/player/player 2/sound-effect/player-2-attack-1.wav",
      spriteSrc: "/player/player 2/Attack1 right.png",
    },
    {
      name: "wizard",
      action: "attack1Left",
      width: 231,
      height: 190,
      spriteNumber: 7,
      soundSrc: "/player/player 2/sound-effect/player-2-attack-1.wav",
      spriteSrc: "/player/player 2/Attack1 left.png",
    },
    {
      name: "wizard",
      action: "attack2Right",
      width: 231,
      height: 190,
      spriteNumber: 7,
      soundSrc: "/player/player 2/sound-effect/player-2-attack-2.wav",
      spriteSrc: "/player/player 2/Attack2 right.png",
    },
    {
      name: "wizard",
      action: "attack2Left",
      width: 231,
      height: 190,
      spriteNumber: 7,
      soundSrc: "/player/player 2/sound-effect/player-2-attack-2.wav",
      spriteSrc: "/player/player 2/Attack2 left.png",
    },
    {
      name: "wizard",
      action: "deadRight",
      width: 231,
      height: 190,
      spriteNumber: 6,
      soundSrc: "/player/player 2/sound-effect/player-2-death.wav",
      spriteSrc: "/player/player 2/Death right.png",
    },
    {
      name: "wizard",
      action: "deadLeft",
      width: 231,
      height: 190,
      spriteNumber: 6,
      soundSrc: "/player/player 2/sound-effect/player-2-death.wav",
      spriteSrc: "/player/player 2/Death right.png",
    },
  ],
];

export const playerEmplacementData = (
  characterNumber: 1 | 2,
  userNumber: 1 | 2,
  ctx: CanvasRenderingContext2D
): playerEmplacementDataType => {
  if (userNumber === 1) {
    if (characterNumber === 1)
      return {
        playerInitialX: 100,
        playerInitialY: 150,
        initialActionId: 0,
        playerSize: 4,
      };
    else
      return {
        playerInitialX: 100,
        playerInitialY: 240,
        initialActionId: 0,
        playerSize: 3,
      };
  } else {
    if (characterNumber === 1)
      return {
        playerInitialX: ctx.canvas.width - 700,
        playerInitialY: 150,
        initialActionId: 1,
        playerSize: 4,
      };
    else
      return {
        playerInitialX: ctx.canvas.width - 700,
        playerInitialY: 240,
        initialActionId: 1,
        playerSize: 3,
      };
  }
};
