// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

async function wait(delay) {
    return new Promise((resolve)=>{
        setTimeout(()=>resolve()
        , delay);
    });
}
function removeElementByValues(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
        if (index !== -1) {
            removeElementByValues(array, item);
        }
    }
}
function getRootPath(path) {
    return document.querySelector("html>head>meta[base-url]")?.getAttribute("base-url") + path;
}
async function getObject(path) {
    return await await fetch(getRootPath(path)).then((res)=>{
        return res.json();
    }).catch((err)=>{
        console.error(err);
    });
}
function getMillis() {
    let date = new Date();
    let hour = date.getHours();
    let min = hour * 60 + date.getMinutes();
    let sec = min * 60 + date.getSeconds();
    let milli = sec * 1000 + date.getMilliseconds();
    return milli;
}
class Queue {
    elements = {};
    head = 0;
    tail = 0;
    constructor(){
        this.elements = {};
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
class Controller {
    keysDown = [];
    mouseActions = new Queue();
    developerMode = false;
    constructor(camera1){
        window.onkeydown = (e)=>{
            if (!e.repeat) {
                this.keysDown.push(e.key.toLowerCase());
                if (e.key === "Enter") {
                    this.developerMode = !this.developerMode;
                }
            }
        };
        window.onkeyup = (e)=>{
            removeElementByValues(this.keysDown, e.key.toLowerCase());
        };
        window.onmousedown = (e)=>{
            let type = "left";
            if (e.button === 1) {
                type = "middle";
            } else if (e.button === 2) {
                type = "right";
            }
            this.mouseActions.enqueue({
                type: type,
                x: Math.floor(e.x * (camera1.width / window.innerWidth)),
                y: Math.floor(e.y * (camera1.height / window.innerHeight))
            });
        };
        window.onwheel = (e)=>{
            this.mouseActions.enqueue({
                type: "wheel",
                up: e.deltaY < 0
            });
        };
    }
    isKeyDown(key) {
        return this.keysDown.includes(key);
    }
    getLastDownKeyFrom(...keys) {
        for(let i = this.keysDown.length - 1; i >= 0; i--){
            let key = this.keysDown[i];
            if (keys.includes(key)) {
                return key;
            }
        }
        return null;
    }
}
class SpriteImage {
    image;
    camera;
    get width() {
        return this.image.width;
    }
    get height() {
        return this.image.height;
    }
    constructor(camera2, image){
        this.camera = camera2;
        this.image = image;
    }
    drawAtUI(x, y) {
        this.camera.context.drawImage(this.image, Math.floor(x), Math.floor(y));
    }
    drawAtUICentered(x, y) {
        this.drawAtUI(x - this.image.width / 2, y - this.image.height / 2);
    }
    drawAt(x, y) {
        let cameraOffsetX = this.camera.x - this.camera.width / 2;
        let cameraOffsetY = this.camera.y - this.camera.height / 2;
        this.camera.context.drawImage(this.image, Math.floor(x - cameraOffsetX), Math.floor(y - cameraOffsetY));
    }
    drawAtCentered(x, y) {
        this.drawAt(x - this.image.width / 2, y - this.image.height / 2);
    }
    cut(x, y, width, height) {
        return new CuttedSprite(this, x, y, width, height);
    }
}
class CuttedSprite {
    spriteImage;
    camera;
    x;
    y;
    width;
    height;
    constructor(sprite, x, y, width, height){
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        if (sprite instanceof SpriteImage) {
            this.spriteImage = sprite;
        } else if (sprite instanceof CuttedSprite) {
            this.spriteImage = sprite.spriteImage;
        } else {
            throw new Error("Invalid Image");
        }
        this.camera = this.spriteImage.camera;
    }
    drawAtUI(x, y) {
        this.camera.context.drawImage(this.spriteImage.image, this.x, this.y, this.width, this.height, Math.floor(x), Math.floor(y), this.width, this.height);
    }
    drawAtUICentered(x, y) {
        this.drawAtUI(x - this.width / 2, y - this.height / 2);
    }
    drawAt(x, y) {
        let cameraOffsetX = this.camera.x - this.camera.width / 2;
        let cameraOffsetY = this.camera.y - this.camera.height / 2;
        this.camera.context.drawImage(this.spriteImage.image, this.x, this.y, this.width, this.height, Math.floor(x - cameraOffsetX), Math.floor(y - cameraOffsetY), this.width, this.height);
    }
    drawAtCentered(x, y) {
        this.drawAt(x - this.width / 2, y - this.height / 2);
    }
    cut(x, y, width, height) {
        x += this.x;
        y += this.y;
        width = Math.min(width, this.width + x);
        height = Math.min(height, this.height + y);
        return new CuttedSprite(this, x, y, width, height);
    }
}
class Camera {
    _scale = 0;
    canvas;
    context;
    width = 0;
    height = 0;
    x = 0;
    y = 0;
    get scale() {
        return this._scale;
    }
    set scale(value) {
        this._scale = value;
        this.setCanvasSize();
    }
    setCanvasSize() {
        this.width = this.canvas.width = Math.floor(window.innerWidth / this.scale);
        this.height = this.canvas.height = Math.floor(window.innerHeight / this.scale);
    }
    constructor(canvas1, scale){
        this.canvas = canvas1;
        this._scale = scale;
        this.context = canvas1.getContext("2d");
        window.onresize = this.setCanvasSize.bind(this);
        this.setCanvasSize();
    }
    async getSpriteImage(path) {
        return new Promise((resolve, reject)=>{
            const img = new Image();
            img.onload = ()=>resolve(new SpriteImage(this, img))
            ;
            img.onerror = reject;
            img.src = getRootPath(path);
        });
    }
    render(renderFunction) {
        let renderLoop = ()=>{
            requestAnimationFrame(renderLoop);
            this.context.clearRect(0, 0, this.width, this.height);
            renderFunction();
        };
        renderLoop();
    }
}
class ControlTiles {
    static get barriers() {
        return {
            leftFull: 139,
            rightFull: 141,
            topFull: 124,
            bottomFull: 156,
            leftTopFull: 123,
            leftBottomFull: 155,
            rightTopFull: 125,
            rightBottomFull: 157,
            leftTop: 142,
            leftBottom: 158,
            rightTop: 143,
            rightBottom: 159,
            full: 140
        };
    }
    static get barrierList() {
        return Object.values(this.barriers);
    }
    static isBlockPointSolid(tileId, x, y) {
        if (tileId === this.barriers.full) {
            return true;
        }
        return this.barrierList.includes(tileId) && (tileId === this.barriers.leftFull && x <= 8 || tileId === this.barriers.rightFull && x > 8 || tileId === this.barriers.topFull && y <= 8 || tileId === this.barriers.bottomFull && y > 8 || tileId === this.barriers.leftTopFull && (x <= 8 || y <= 8) || tileId === this.barriers.leftBottomFull && (x <= 8 || y > 8) || tileId === this.barriers.rightTopFull && (x > 8 || y <= 8) || tileId === this.barriers.rightBottomFull && (x > 8 || y > 8) || tileId === this.barriers.leftTop && x <= 8 && y <= 8 || tileId === this.barriers.leftBottom && x <= 8 && y > 8 || tileId === this.barriers.rightTop && x > 8 && y <= 8 || tileId === this.barriers.rightBottom && x > 8 && y > 8);
    }
    static get spawn() {
        return 137;
    }
    static get waterTiles() {
        return {
            waterFunction: 138,
            waterAnimation: [
                96,
                97,
                98,
                99
            ]
        };
    }
    static get all() {
        return [
            ...this.barrierList,
            this.spawn,
            this.waterTiles.waterFunction
        ];
    }
}
class Map {
    drawEntities;
    controller;
    camera;
    tilesSprite;
    data;
    entityLayer = 1;
    get layerCount() {
        return this.data.layers.length;
    }
    constructor(camera3, sprite, data, controller1, drawEntities){
        this.camera = camera3;
        this.tilesSprite = sprite;
        this.data = data;
        this.controller = controller1;
        this.drawEntities = drawEntities;
    }
    static toGridUnits(value) {
        return Math.floor(value / 16);
    }
    static toPixelUnits(value) {
        return value * 16;
    }
    containsTile(x, y, id) {
        for(let i = 0; i < this.layerCount; i++){
            if (this.data.layers[i][x][y] === id) {
                return true;
            }
        }
        return false;
    }
    isEmpty(x, y) {
        for(let i = 0; i < this.layerCount; i++){
            if (this.data.layers[i][x][y] !== -1) {
                return false;
            }
        }
        return true;
    }
    canWalk(x, y) {
        return this.isSolid(x, y) || this.isSolid(x + 6, y) || this.isSolid(x - 6, y) || this.isSolid(x, y + 6) || this.isSolid(x, y - 6) || this.isSolid(x - 6, y + 6) || this.isSolid(x - 6, y - 6) || this.isSolid(x + 6, y + 6) || this.isSolid(x + 6, y - 6);
    }
    isSolid(x, y) {
        let gridX = Map.toGridUnits(x);
        let gridY = Map.toGridUnits(y);
        return x < 0 || x >= Map.toPixelUnits(this.data.width) || y < 0 || y >= Map.toPixelUnits(this.data.height) || this.isEmpty(gridX, gridY) || this.data.layers.some((layer)=>ControlTiles.isBlockPointSolid(layer[gridX][gridY], Math.floor(x % 16), Math.floor(y % 16))
        );
    }
    draw() {
        let tilesInWidth = this.tilesSprite.width / 16;
        for(let layerId = this.layerCount - 1; layerId >= 0; layerId--){
            for(let x = 0; x < this.data.width; x++){
                for(let y = 0; y < this.data.height; y++){
                    let id = this.data.layers[layerId][x][y];
                    if (id === -1 || ControlTiles.all.includes(id) && !this.controller.developerMode) {
                        continue;
                    }
                    let waterAnimation = ControlTiles.waterTiles.waterAnimation;
                    if (waterAnimation.includes(id)) {
                        id = waterAnimation[Math.floor(getMillis() / 250) % waterAnimation.length];
                    }
                    this.tilesSprite.cut(Math.floor(id % tilesInWidth) * 16, Math.floor(id / tilesInWidth) * 16, 16, 16).drawAt(x * 16, y * 16);
                }
            }
            if (this.entityLayer == layerId) {
                this.drawEntities();
            }
        }
    }
}
var Direction;
(function(Direction1) {
    Direction1[Direction1["Left"] = 3] = "Left";
    Direction1[Direction1["Right"] = 1] = "Right";
    Direction1[Direction1["Up"] = 2] = "Up";
    Direction1[Direction1["Down"] = 0] = "Down";
    Direction1[Direction1["None"] = 4] = "None";
})(Direction || (Direction = {}));
class Player {
    isWalking = false;
    camera;
    map;
    sprites = [];
    overlaySprites = [];
    animationState = 0;
    direction = Direction.Down;
    _x = 0;
    _y = 0;
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(value) {
        if (!this.map.canWalk(value, this.y)) {
            this._x = value;
            this.camera.x = value;
        }
    }
    set y(value) {
        if (!this.map.canWalk(this.x, value)) {
            this._y = value;
            this.camera.y = value;
        }
    }
    constructor(camera4, sprite, map1, spawn, ...overlaySprites){
        this.camera = camera4;
        this.map = map1;
        this.camera.x = this._x = Map.toPixelUnits(spawn.x) + 8;
        this.camera.y = this._y = Map.toPixelUnits(spawn.y) + 8;
        for(let y = 0; y < 4; y++){
            let row = [];
            for(let x = 0; x < 4; x++){
                row.push(sprite.cut(x * 16, y * 32, 16, 32));
            }
            this.sprites.push(row);
        }
        for (let overlaySprite of overlaySprites){
            let overlaySpritesSprite = [];
            for(let y = 0; y < 4; y++){
                let row = [];
                for(let x = 0; x < 4; x++){
                    row.push(overlaySprite.cut(x * 16, y * 32, 16, 32));
                }
                overlaySpritesSprite.push(row);
            }
            this.overlaySprites.push(overlaySpritesSprite);
        }
    }
    modifyPosition(direction, difference) {
        switch(direction){
            case Direction.Left:
                this.x -= difference;
                break;
            case Direction.Right:
                this.x += difference;
                break;
            case Direction.Up:
                this.y -= difference;
                break;
            case Direction.Down:
                this.y += difference;
                break;
        }
    }
    async walk(direction, getSpeed, hasStopped) {
        if (this.isWalking) {
            return;
        }
        this.isWalking = true;
        this.direction = direction;
        for(let i = 0; i < 16; i++){
            await wait(10 / getSpeed());
            if (hasStopped()) {
                this.animationState = 0;
                this.isWalking = false;
                return;
            }
            if (i % 8 == 0) {
                this.animationState = (this.animationState + 1) % 4;
            }
            this.modifyPosition(direction, 1);
        }
        this.isWalking = false;
    }
    async draw() {
        this.sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);
        for (const sprites of this.overlaySprites){
            sprites[this.direction][this.animationState].drawAtCentered(this.x, this.y - 8);
        }
    }
}
class ItemRenderer {
    animatedSprite;
    delay;
    width = 16;
    height = 16;
    constructor(animatedSprite, delay){
        this.animatedSprite = animatedSprite;
        this.delay = delay;
    }
    get sprite() {
        let frames = this.animatedSprite.width / 16;
        let frame = Math.floor(getMillis() / this.delay) % frames;
        return this.animatedSprite.cut(frame * 16, 0, 16, 16);
    }
    drawAtUI(x, y) {
        this.sprite.drawAtUI(x, y);
    }
    drawAtUICentered(x, y) {
        this.sprite.drawAtUICentered(x, y);
    }
    drawAt(x, y) {
        this.sprite.drawAt(x, y);
    }
    drawAtCentered(x, y) {
        this.sprite.drawAtCentered(x, y);
    }
    cut(x, y, width, height) {
        return this.sprite.cut(x, y, width, height);
    }
}
const canvas = document.querySelector("canvas");
const camera = new Camera(canvas, 3);
const controller = new Controller(camera);
let playerSprite;
let mapSprite;
let player;
let map;
let mapData;
let slot;
let cursor;
let cursorPosition = {
    x: 0,
    y: 0
};
let hose;
let emerald;
canvas.addEventListener("mousemove", (event)=>{
    cursorPosition = {
        x: event.x,
        y: event.y
    };
});
(async ()=>{
    playerSprite = await camera.getSpriteImage("assets/images/entities/human.png");
    mapSprite = await camera.getSpriteImage("assets/images/tiles/map.png");
    cursor = await camera.getSpriteImage("assets/images/ui/cursor.png");
    slot = await camera.getSpriteImage("assets/images/ui/inventorySlot.png");
    hose = await camera.getSpriteImage("assets/images/entities/hose.png");
    emerald = await camera.getSpriteImage("assets/images/items/pyschoEmerald.png");
    mapData = await getObject("map.json");
})().then(()=>{
    map = new Map(camera, mapSprite, mapData, controller, ()=>{
        player.draw();
    });
    let randomSpwanIndex = Math.floor(Math.random() * mapData.spawnPoints.length);
    player = new Player(camera, playerSprite, map, mapData.spawnPoints[randomSpwanIndex], hose);
    setInterval(()=>{
        let getSpeed = ()=>controller.isKeyDown("shift") ? 2 : 1
        ;
        let getLastWalkKey = ()=>controller.getLastDownKeyFrom("w", "a", "s", "d")
        ;
        if (getLastWalkKey() === "w") {
            player.walk(Direction.Up, getSpeed, ()=>getLastWalkKey() !== "w"
            );
        }
        if (getLastWalkKey() === "a") {
            player.walk(Direction.Left, getSpeed, ()=>getLastWalkKey() !== "a"
            );
        }
        if (getLastWalkKey() === "s") {
            player.walk(Direction.Down, getSpeed, ()=>getLastWalkKey() !== "s"
            );
        }
        if (getLastWalkKey() === "d") {
            player.walk(Direction.Right, getSpeed, ()=>getLastWalkKey() !== "d"
            );
        }
        while(!controller.mouseActions.isEmpty){
            let action = controller.mouseActions.dequeue();
            if (action.type === "wheel") {
                camera.scale = Math.max(2, Math.min(5, camera.scale + (action.up ? 1 : -1)));
            }
        }
    }, 10);
    camera.render(()=>{
        map.draw();
        for(let i = -4; i <= 4; i++){
            slot.drawAtUICentered(camera.width / 2 + i * 19, camera.height - 12);
        }
        new ItemRenderer(emerald, 100).drawAtUICentered(camera.width / 2, camera.height - 12);
        cursor.drawAtUI(cursorPosition.x * (camera.width / canvas.clientWidth), cursorPosition.y * (camera.height / canvas.clientHeight));
    });
});
