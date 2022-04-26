import { getObject } from "./misc/Utils.ts";

import MouseWheelAction from './controller/MouseWheelAction.ts';
import Controller from "./controller/Controller.ts";

import Camera from "./render/Camera.ts";
import Sprite from "./render/sprites/Sprite.ts";

import Map from "./world/Map.ts";
import MapData from "./world/MapData.ts";

import Direction from "./render/Direction.ts";
import Player from "./world/Player.ts";

import ItemSprite from "./render/sprites/ItemSprite.ts";

const canvas = <HTMLCanvasElement>document.querySelector("canvas");
const camera = new Camera(canvas, 3);
const controller = new Controller(camera);

let playerSprite: Sprite;
let mapSprite: Sprite;

let player: Player;
let map: Map;
let mapData: MapData;

let slot: Sprite;

let cursor: Sprite;
let cursorPosition = { x: 0, y: 0 };

let hose: Sprite;
let emerald: Sprite;

canvas.addEventListener("mousemove", event => {
    cursorPosition = {
        x: event.x,
        y: event.y
    };
});

(async () => {
    playerSprite = await camera.getSpriteImage("assets/images/entities/human.png");
    mapSprite = await camera.getSpriteImage("assets/images/tiles/map.png");
    cursor = await camera.getSpriteImage("assets/images/ui/cursor.png");
    slot = await camera.getSpriteImage("assets/images/ui/inventorySlot.png");
    hose = await camera.getSpriteImage("assets/images/entities/hose.png");
    emerald = await camera.getSpriteImage("assets/images/items/pyschoEmerald.png");
    mapData = await getObject("map.json");
})().then(() => {
    map = new Map(camera, mapSprite, mapData, controller, () => {
        player.draw();
    });

    let randomSpwanIndex = Math.floor(Math.random() * mapData.spawnPoints.length);
    player = new Player(camera, playerSprite, map, mapData.spawnPoints[randomSpwanIndex], hose);
    
    setInterval(() => {
        let getSpeed = () => controller.isKeyDown("shift") ? 2 : 1;
        let getLastWalkKey = () => controller.getLastDownKeyFrom("w", "a", "s", "d");

        if (getLastWalkKey() === "w") {
            player.walk(Direction.Up, getSpeed, () => getLastWalkKey() !== "w");
        }
    
        if (getLastWalkKey() === "a") {
            player.walk(Direction.Left, getSpeed, () => getLastWalkKey() !== "a");
        }
    
        if (getLastWalkKey() === "s") {
            player.walk(Direction.Down, getSpeed, () => getLastWalkKey() !== "s");
        }
    
        if (getLastWalkKey() === "d") {
            player.walk(Direction.Right, getSpeed, () => getLastWalkKey() !== "d");
        }

        while (!controller.mouseActions.isEmpty) {
            let action = controller.mouseActions.dequeue();

            if (action.type === "wheel") {
                camera.scale = Math.max(2, Math.min(5, camera.scale + ((<MouseWheelAction>action).up ? 1 : -1)));
            }
        }
    }, 10);
    
    camera.render(() => {
        map.draw();

        for (let i = -4; i <= 4; i++) {
            slot.drawAtUICentered((camera.width / 2) + (i * 19), camera.height - 12);
        }

        new ItemSprite(emerald, 100).drawAtUICentered(camera.width / 2, camera.height - 12);

        cursor.drawAtUI(cursorPosition.x * (camera.width / canvas.clientWidth), cursorPosition.y * (camera.height / canvas.clientHeight));
    });
});
