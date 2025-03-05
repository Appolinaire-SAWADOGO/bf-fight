import { actionsType } from "@/lib/types";
import { Player } from "./player";
import { actions, players } from "@/lib/utils";

export class Actions {
  public player: Player;
  public spriteSrc: string;
  public spriteWidth: number;
  public spriteHeight: number;
  public spriteNumber: number;

  public actionName: actionsType;

  constructor(player: Player, actionName: actionsType) {
    this.player = player;
    this.actionName = actionName;

    this.spriteSrc =
      players[this.player.playerId][actions[actionName]].spriteSrc;
    this.spriteWidth = players[this.player.playerId][actions[actionName]].width;
    this.spriteHeight =
      players[this.player.playerId][actions[actionName]].height;
    this.spriteNumber =
      players[this.player.playerId][actions[actionName]].spriteNumber;
  }

  public update() {
    this.player.actionImage.src = this.spriteSrc;
    this.player.actionId = actions[this.actionName];
    this.player.action = this.player.actions[
      actions[this.actionName]
    ] as jumpRight;
    this.player.actionSpriteWidth = this.spriteWidth;
    this.player.actionSpriteHeight = this.spriteHeight;
    this.player.actionSpriteNumber = this.spriteNumber;
  }
}

export class IdleRight extends Actions {
  constructor(player: Player) {
    super(player, "idleRight");
  }

  private spriteAnimation() {
    this.player.actionSpriteCount++;
    if (this.player.actionSpriteCount > this.player.actionSpriteCountMax) {
      if (this.player.actionSpriteFrame < this.player.actionSpriteNumber)
        this.player.actionSpriteFrame++;
      else this.player.actionSpriteFrame = 0;
      this.player.actionSpriteCount = 0;
    }
  }

  private touchsControl() {
    // Arrow up
    if (this.player.controls.keys === "ArrowUp")
      this.player.resetRightSpriteAnimation(actions.jumpRight);
    //Arrow Right
    else if (this.player.controls.keys === "ArrowRight")
      this.player.resetRightSpriteAnimation(actions.runRight);
    // ArrowLeft
    else if (this.player.controls.keys === "ArrowLeft")
      this.player.resetRightSpriteAnimation(actions.runLeft);
    // a
    else if (this.player.controls.keys === "a")
      this.player.resetRightSpriteAnimation(actions.attack1Right);
    // b
    else if (this.player.controls.keys === "b")
      this.player.resetRightSpriteAnimation(actions.attack2Right);
  }

  public update() {
    super.update();

    // sprite animation
    this.spriteAnimation();

    // touch contols
    this.touchsControl();
  }
}

export class IdleLeft extends Actions {
  constructor(player: Player) {
    super(player, "idleLeft");
  }

  private spriteAnimation() {
    this.player.actionSpriteCount++;
    if (this.player.actionSpriteCount > this.player.actionSpriteCountMax) {
      if (this.player.actionSpriteFrame > 0) this.player.actionSpriteFrame--;
      else this.player.actionSpriteFrame = this.player.actionSpriteNumber;
      this.player.actionSpriteCount = 0;
    }
  }

  private touchsControl() {
    //  Arrow up
    if (this.player.controls.keys === "ArrowUp")
      this.player.resetLeftSpriteAnimation(actions.jumpLeft);
    // ArrowRight
    else if (this.player.controls.keys === "ArrowRight")
      this.player.resetRightSpriteAnimation(actions.runRight);
    // ArrowLeft
    else if (this.player.controls.keys === "ArrowLeft")
      this.player.resetLeftSpriteAnimation(actions.runLeft);
    // a
    else if (this.player.controls.keys === "a")
      this.player.resetLeftSpriteAnimation(actions.attack1Left);
    // b
    else if (this.player.controls.keys === "b")
      this.player.resetLeftSpriteAnimation(actions.attack2Left);
  }

  public update() {
    super.update();

    // sprite animation
    this.spriteAnimation();

    // touch contols
    this.touchsControl();
  }
}

export class RunRight extends Actions {
  constructor(player: Player) {
    super(player, "runRight");
  }

  private rightXMovement() {
    if (this.player.x + this.spriteWidth * 2 < this.player.ctx.canvas.width)
      this.player.x += 6;
  }

  private spriteAnimation() {
    // sprite animation
    this.player.actionSpriteCount++;
    if (this.player.actionSpriteCount > this.player.actionSpriteCountMax) {
      if (this.player.actionSpriteFrame < this.player.actionSpriteNumber)
        this.player.actionSpriteFrame++;
      else this.player.actionSpriteFrame = 0;
      this.player.actionSpriteCount = 0;
    }
  }

  private touchsControl() {
    // no ArrowRight
    if (this.player.controls.keys != "ArrowRight") {
      this.player.actionSpriteCountMax = 4;
      this.player.resetRightSpriteAnimation(actions.idleRight);
    }
  }

  public update() {
    super.update();

    // animation speed adjustment
    this.player.actionSpriteCountMax = 3;

    // Right x movement
    this.rightXMovement();

    // sprite animation
    this.spriteAnimation();

    // touch contols
    this.touchsControl();
  }
}

export class RunLeft extends Actions {
  constructor(player: Player) {
    super(player, "runLeft");
  }

  private LeftXMovement() {
    this.player.actionSpriteCountMax = 3;
    if (this.player.x > -this.player.actionSpriteWidth) this.player.x -= 6;
  }

  private spriteAnimation() {
    // sprite animation
    this.player.actionSpriteCount++;
    if (this.player.actionSpriteCount > this.player.actionSpriteCountMax) {
      if (this.player.actionSpriteFrame > 0) this.player.actionSpriteFrame--;
      else this.player.actionSpriteFrame = this.player.actionSpriteCountMax;
      this.player.actionSpriteCount = 0;
    }
  }

  private touchsControl() {
    // no ArrowLeft
    if (this.player.controls.keys != "ArrowLeft") {
      this.player.actionSpriteCountMax = 4;
      this.player.resetLeftSpriteAnimation(actions.idleLeft);
    }
  }

  public update() {
    super.update();

    // animation speed adjustment
    this.player.actionSpriteCountMax = 3;

    // left x movement
    this.LeftXMovement();

    // sprite animation
    this.spriteAnimation();

    // touch contols
    this.touchsControl();
  }
}

// ---->>> This class needs to be improved !
export class jumpRight extends Actions {
  constructor(player: Player) {
    super(player, "jumpRight");
  }

  private player1() {
    // gravity action
    this.player.y -= this.player.speedY;
    this.player.speedY -= this.player.gravity;

    if (this.player.speedY <= 0) this.player.actionSpriteFrame = 1;

    if (this.player.y > this.player.initialY) {
      this.player.y = this.player.initialY;
      this.player.speedY = 0;
      this.player.action = this.player.actions[actions.idleRight] as IdleRight;
    }
  }

  private player0() {
    // sprite animation
    if (this.player.actionSpriteFrame >= this.player.actionSpriteNumber) {
      this.player.action = this.player.actions[actions.idleRight] as IdleRight;
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame < this.player.actionSpriteNumber &&
      this.player.actionSpriteFrame != 4 &&
      this.player.actionSpriteFrame != 5
    ) {
      this.player.actionSpriteFrame++;
      this.player.actionSpriteCount = 0;
    }

    const ok =
      this.player.actionSpriteFrame === 4 ||
      this.player.actionSpriteFrame === 5;

    if (!ok) return;

    this.player.y -= this.player.speedY;
    this.player.speedY -= this.player.gravity;

    if (this.player.speedY <= 0) this.player.actionSpriteFrame = 5;

    if (this.player.y > this.player.initialY) {
      this.player.y = this.player.initialY;
      this.player.speedY = 0;
      this.player.action = this.player.actions[actions.idleRight] as IdleRight;
    }
  }

  private playActionSound() {
    if (this.player.speedY === 8 && this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private touchsControl() {
    // ArrowRight
    if (this.player.controls.keys === "ArrowRight") this.player.x += 8;
    else if (this.player.controls.keys === "ArrowLeft")
      this.player.action = this.player.actions[actions.jumpLeft] as jumpLeft;
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // if playerID = 1
    if (this.player.playerId === 1) {
      this.player1();

      // touchs control
      this.touchsControl();

      return;
    }

    // if playerId = 0
    this.player0();

    // touchs control
    this.touchsControl();
  }
}

// ---->>> This class needs to be improved !
export class jumpLeft extends Actions {
  constructor(player: Player) {
    super(player, "jumpLeft");
  }

  private player1() {
    // gravity action
    this.player.y -= this.player.speedY;
    this.player.speedY -= this.player.gravity;

    if (this.player.speedY <= 0) {
      this.player.actionSpriteFrame = 0;
    }

    if (this.player.y > this.player.initialY) {
      this.player.y = this.player.initialY;
      this.player.speedY = 0;
      this.player.action = this.player.actions[actions.idleLeft] as IdleLeft;
    }
  }

  private player0() {
    if (this.player.actionSpriteFrame <= 0) {
      this.player.action = this.player.actions[actions.idleLeft] as IdleLeft;
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame <= this.player.actionSpriteNumber &&
      this.player.actionSpriteFrame != 3 &&
      this.player.actionSpriteFrame != 2
    ) {
      this.player.actionSpriteFrame--;
      this.player.actionSpriteCount = 0;
    }

    const ok =
      this.player.actionSpriteFrame === 3 ||
      this.player.actionSpriteFrame === 2;

    if (!ok) return;

    this.player.y -= this.player.speedY;
    this.player.speedY -= this.player.gravity;

    if (this.player.speedY <= 0) {
      this.player.actionSpriteFrame = 2;
    }

    if (this.player.y > this.player.initialY) {
      this.player.y = this.player.initialY;
      this.player.speedY = 0;
      this.player.action = this.player.actions[actions.idleLeft] as IdleLeft;
    }
  }

  private playActionSound() {
    if (
      this.player.speedY === 8 &&
      this.player.actionSpriteFrame === this.player.action.spriteNumber
    )
      this.player.soundEffect(this.actionName);
  }

  private touchsControl() {
    // ArrowLeft
    if (this.player.controls.keys === "ArrowLeft") this.player.x -= 8;
    else if (this.player.controls.keys === "ArrowRight")
      this.player.action = this.player.actions[actions.jumpRight] as jumpRight;
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // if playerID = 1
    if (this.player.playerId === 1) {
      this.player1();

      // touchs control
      this.touchsControl();

      return;
    }

    // if playerId = 0
    this.player0();

    // touchs control
    this.touchsControl();
  }
}

export class Attack1Right extends Actions {
  constructor(player: Player) {
    super(player, "attack1Right");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame >= this.player.actionSpriteNumber) {
      this.player.resetRightSpriteAnimation(actions.idleRight);
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame >= 0
    ) {
      this.player.actionSpriteFrame++;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // sprite animation
    this.spriteAnimation();
  }
}

export class Attack1Left extends Actions {
  constructor(player: Player) {
    super(player, "attack1Left");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame <= 0) {
      this.player.resetLeftSpriteAnimation(actions.idleLeft);
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame <= this.player.actionSpriteNumber
    ) {
      this.player.actionSpriteFrame--;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // sprite animation
    this.spriteAnimation();
  }
}

export class Attack2Right extends Actions {
  constructor(player: Player) {
    super(player, "attack2Right");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame >= this.player.actionSpriteNumber) {
      this.player.resetRightSpriteAnimation(actions.idleRight);
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame >= 0
    ) {
      this.player.actionSpriteFrame++;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // sprite animation
    this.spriteAnimation();
  }
}

export class Attack2Left extends Actions {
  constructor(player: Player) {
    super(player, "attack2Left");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === this.player.actionSpriteNumber)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame <= 0) {
      this.player.resetLeftSpriteAnimation(actions.idleLeft);
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame <= this.player.actionSpriteNumber
    ) {
      this.player.actionSpriteFrame--;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // sprite animation
    this.spriteAnimation();
  }
}

export class DeadRight extends Actions {
  constructor(player: Player) {
    super(player, "deadRight");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame >= this.player.actionSpriteNumber) {
      this.player.main.deadAnimationFinish = true;
      return;
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame >= 0
    ) {
      this.player.actionSpriteFrame++;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // animation speed adjustment
    this.player.actionSpriteCountMax = 0.5;

    // sprite animation
    this.spriteAnimation();
  }
}

export class DeadLeft extends Actions {
  constructor(player: Player) {
    super(player, "deadLeft");
  }

  private playActionSound() {
    if (this.player.actionSpriteFrame === 0)
      this.player.soundEffect(this.actionName);
  }

  private spriteAnimation() {
    if (this.player.actionSpriteFrame <= 0) {
      this.player.main.deadAnimationFinish = true;
      return;
    } else this.player.actionSpriteCount++;

    if (
      this.player.actionSpriteCount > this.player.actionSpriteCountMax &&
      this.player.actionSpriteFrame <= this.player.actionSpriteNumber
    ) {
      this.player.actionSpriteFrame--;
      this.player.actionSpriteCount = 0;
    }
  }

  public update() {
    super.update();

    // play action sound
    this.playActionSound();

    // animation speed adjustment
    this.player.actionSpriteCountMax = 0.5;

    // sprite animation
    this.spriteAnimation();
  }
}
