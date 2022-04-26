import { removeElementByValues } from "../misc/Utils.ts";

import Camera from "../render/Camera.ts";
import Queue from "../misc/Queue.ts";

import MouseActionType from "./MouseActionType.ts";
import MouseAction from "./MouseAction.ts";
import MouseClickAction from "./MouseClickAction.ts";
import MouseWheelAction from "./MouseWheelAction.ts";

export default class Controller {

    keysDown: string[] = [];
    mouseActions = new Queue<MouseAction>();
    developerMode = false;
    
    constructor(camera: Camera) {
        window.onkeydown = e => {
            if (!e.repeat) {
                this.keysDown.push(e.key.toLowerCase());

                if (e.key === "Enter") {
                    this.developerMode = !this.developerMode;
                }
            }
        };

        window.onkeyup = e => {
            removeElementByValues(this.keysDown, e.key.toLowerCase());
        };

        window.onmousedown = e => {
            let type: MouseActionType = "left";

            if (e.button === 1) {
                type = "middle";
            } else if (e.button === 2) {
                type = "right";
            }

            this.mouseActions.enqueue(<MouseClickAction>{
                type: type,
                x: Math.floor(e.x * (camera.width / window.innerWidth)),
                y: Math.floor(e.y * (camera.height / window.innerHeight))
            });
        };

        window.onwheel = e => {
            this.mouseActions.enqueue(<MouseWheelAction>{
                type: "wheel",
                up: e.deltaY < 0
            });
        };
    }

    isKeyDown(key: string) {
        return this.keysDown.includes(key);
    }

    getLastDownKeyFrom(...keys: string[]): string | null {
        for (let i = this.keysDown.length - 1; i >= 0; i--) {
            let key = this.keysDown[i];

            if (keys.includes(key)) {
                return key;
            }
        }

        return null;
    }
}
