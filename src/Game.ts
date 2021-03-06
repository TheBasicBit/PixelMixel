import MouseWheelAction from "./controller/MouseWheelAction.ts";
import NetworkManager from "./network/NetworkManager.ts";
import Controller from "./controller/Controller.ts";
import Direction from "./render/Direction.ts";
import Camera from "./render/Camera.ts";
import Player from "./world/Player.ts";
import Map from "./world/Map.ts";

import { loadResources, Resources } from "./Resources.ts";
import ItemSprite from "./render/sprites/ItemSprite.ts";

export default class Game {

    camera?: Camera;
    controller?: Controller;

    map?: Map;
    player?: Player;
    otherPlayers: { [id: string]: Player } = {};

    resources?: Resources;
    networkManager?: NetworkManager;

    constructor() {
        (async () => {
            const camera = this.camera = new Camera(<HTMLCanvasElement>document.querySelector("canvas"), 3);
            this.controller = new Controller(this.camera);

            this.resources = await loadResources(this.camera);
            
            this.map = new Map(this.camera, this.resources.mapSprite, this.resources.mapData, this.controller);
            
            let spawnPoints = this.map.data.spawnPoints;
            let randomSpwanIndex = Math.floor(Math.random() * spawnPoints.length);
            this.player = new Player(this, this.resources.playerSprite, spawnPoints[randomSpwanIndex], true);

            this.networkManager = new NetworkManager(this);
            await this.networkManager.connect();

            let lastFrameTime = 0;

            const gameLoop = (progress: number) => {
                camera.deltaTime = progress - lastFrameTime;

                camera.context.clearRect(0, 0, camera.width, camera.height);

                console.log();
                this.update();
                this.render();

                lastFrameTime = progress;
                requestAnimationFrame(gameLoop);
            };

            requestAnimationFrame(gameLoop);
        })();
    }
    
    update() {
        let speed = this.controller!.isKeyDown("shift") ? 2 : 1;
        let getLastWalkKey = () => this.controller!.getLastDownKeyFrom("w", "a", "s", "d");

        if (getLastWalkKey() === "w") {
            this.player!.walk(Direction.Up, speed);
        }
    
        if (getLastWalkKey() === "a") {
            this.player!.walk(Direction.Left, speed);
        }
    
        if (getLastWalkKey() === "s") {
            this.player!.walk(Direction.Down, speed);
        }
    
        if (getLastWalkKey() === "d") {
            this.player!.walk(Direction.Right, speed);
        }

        while (!this.controller!.mouseActions.isEmpty) {
            let action = this.controller!.mouseActions.dequeue();

            if (action.type === "wheel") {
                this.camera!.scale = Math.max(2, Math.min(5, this.camera!.scale + ((<MouseWheelAction>action).up ? 1 : -1)));
            }
        }
    }

    render() {
        const canvas = this.camera!.canvas;

        this.map?.draw(() => {
            for (const player of [...Object.values(this.otherPlayers), this.player!].sort((a, b) => a.y - b.y)) {
                player.draw();
            }
        });

        for (let i = -4; i <= 4; i++) {
            this.resources?.slot.drawAtUICentered((this.camera!.width / 2) + (i * 19), this.camera!.height - 12);
        }

        new ItemSprite(this.resources!.emerald, 100).drawAtUICentered(this.camera!.width / 2, this.camera!.height - 12);

        const drawHealth = (max: number, current: number) => {
            current = Math.min(max, current);

            let health = this.resources!.health!;
            let heartWidth = health.width / 5;
            let heartHeight = health.height;
            let offset = 3;
            
            for (let i = 0; i < current - 1; i++) {
                health.cut(0, 0, heartWidth, heartHeight).drawAtUI(offset + i * heartWidth, offset);
            }

            if (current === Math.floor(current)) {
                health.cut(0, 0, heartWidth, heartHeight).drawAtUI(offset + (current - 1) * heartWidth, offset);
            } else {
                current = Math.floor(current * 4) / 4;
                health.cut((4 - ((current - Math.floor(current)) * 4)) * heartWidth, 0, heartWidth, heartHeight).drawAtUI(offset + Math.floor(current) * heartWidth, offset);
            }

            for (let i = (current === Math.floor(current) ? current : Math.floor(current) + 1); i < max; i++) {
                health.cut(4 * heartWidth, 0, heartWidth, heartHeight).drawAtUI(offset + i * heartWidth, offset);
            }
        };

        drawHealth(5, 5);

        let cursorPosition = this.controller!.cursorPosition;
        this.resources?.cursor.drawAtUI(cursorPosition.x * (this.camera!.width / canvas.clientWidth), cursorPosition.y * (this.camera!.height / canvas.clientHeight));
    }
}