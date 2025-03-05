export class Paralax {
  public image1 = new Image();
  public image2 = new Image();
  public image3 = new Image();
  public image4 = new Image();
  public cloud1 = new Image();
  public cloud2 = new Image();

  public cloudWidth = 640;
  public cloudHeight = 360;
  public cloudSpeed: number;

  public images: Array<{
    type: "image" | "cloud";
    x: number;
    y: number;
    width: number;
    height: number;
    value: HTMLImageElement;
  }>;

  public ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.image1.src = "/paralax/1.Sky.png";
    this.image2.src = "/paralax/2.Buildings.png";
    this.image3.src = "/paralax/3.Wall.png";
    this.image4.src = "/paralax/4.Sidewalk.png";
    this.cloud1.src = "/paralax/cloud/cloud.png";
    this.cloud2.src = "/paralax/cloud/cloud.png";

    this.images = [
      {
        type: "image",
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        value: this.image1,
      },
      {
        type: "cloud",
        x: ctx.canvas.width / 1.5,
        y: 0,
        width: this.cloudWidth,
        height: this.cloudHeight,
        value: this.cloud1,
      },
      {
        type: "cloud",
        x: 0,
        y: 100,
        width: this.cloudWidth,
        height: this.cloudHeight,
        value: this.cloud2,
      },
      {
        type: "image",
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        value: this.image2,
      },
      {
        type: "image",
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        value: this.image3,
      },
      {
        type: "image",
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        value: this.image4,
      },
    ];

    this.ctx = ctx;

    this.cloudSpeed = 0.5;
  }

  public draw() {
    this.images.forEach((image) => {
      this.ctx.drawImage(
        image.value,
        image.x,
        image.y,
        image.width,
        image.height
      );
    });
  }

  public update() {
    this.draw();

    this.images.map((image) => {
      if (image.type === "cloud") {
        if (image.x === -this.cloudWidth) image.x = this.ctx.canvas.width;
        else image.x -= this.cloudSpeed;
      }
    });
  }
}
