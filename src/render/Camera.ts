import SpriteImage from "./sprites/SpriteImage.ts";
import { getRootPath } from "../misc/Utils.ts";

export default class Camera {

    _scale: number = 0;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
 
    width = 0;
    height = 0;

    x = 0;
    y = 0;

    deltaTime = 0;

    get scale() {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
        this.setCanvasSize();
    }

    setCanvasSize() {
        this.width = this.canvas.width = Math.floor(window.innerWidth / this.scale);
        this.height = this.canvas.height = Math.floor(window.innerHeight / this.scale);
    }

    constructor(canvas: HTMLCanvasElement, scale: number) {
        this.canvas = canvas;
        this._scale = scale;

        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");

        window.onresize = this.setCanvasSize.bind(this);
        this.setCanvasSize();
    }
}
