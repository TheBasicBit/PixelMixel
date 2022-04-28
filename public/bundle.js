// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function removeElementByValues(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
        if (index !== -1) {
            removeElementByValues(array, item);
        }
    }
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
    developerMode = false;
    mouseActions = new Queue();
    cursorPosition = {
        x: 0,
        y: 0
    };
    constructor(camera){
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
                x: Math.floor(e.x * (camera.width / window.innerWidth)),
                y: Math.floor(e.y * (camera.height / window.innerHeight))
            });
        };
        window.onwheel = (e)=>{
            this.mouseActions.enqueue({
                type: "wheel",
                up: e.deltaY < 0
            });
        };
        window.addEventListener("mousemove", (event)=>{
            this.cursorPosition = {
                x: event.x,
                y: event.y
            };
        });
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
class Camera {
    _scale = 0;
    canvas;
    context;
    width = 0;
    height = 0;
    x = 0;
    y = 0;
    deltaTime = 0;
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
    constructor(canvas, scale){
        this.canvas = canvas;
        this._scale = scale;
        this.context = canvas.getContext("2d");
        window.onresize = this.setCanvasSize.bind(this);
        this.setCanvasSize();
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
    controller;
    camera;
    tilesSprite;
    data;
    entityLayer = 1;
    get layerCount() {
        return this.data.layers.length;
    }
    constructor(camera, sprite, data, controller){
        this.camera = camera;
        this.tilesSprite = sprite;
        this.data = data;
        this.controller = controller;
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
    draw(drawEntities) {
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
                drawEntities();
            }
        }
    }
}
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
    constructor(camera, sprite, map, spawn, ...overlaySprites){
        this.camera = camera;
        this.map = map;
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
class SpriteImage {
    image;
    camera;
    get width() {
        return this.image.width;
    }
    get height() {
        return this.image.height;
    }
    constructor(camera, image){
        this.camera = camera;
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
function getUrl(path) {
    return document.querySelector("html>head>meta[base-url]")?.getAttribute("base-url") + path;
}
async function getObjectFromJson(path) {
    return await await fetch(getUrl(path)).then((res)=>{
        return res.json();
    }).catch((err)=>{
        console.error(err);
    });
}
async function getSpriteImage(camera, path) {
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(new SpriteImage(camera, img))
        ;
        img.onerror = reject;
        img.src = getUrl(path);
    });
}
async function loadResources(camera) {
    return {
        playerSprite: await getSpriteImage(camera, "assets/images/entities/human.png"),
        mapSprite: await getSpriteImage(camera, "assets/images/tiles/map.png"),
        cursor: await getSpriteImage(camera, "assets/images/ui/cursor.png"),
        slot: await getSpriteImage(camera, "assets/images/ui/inventorySlot.png"),
        hose: await getSpriteImage(camera, "assets/images/entities/hose.png"),
        emerald: await getSpriteImage(camera, "assets/images/items/pyschoEmerald.png"),
        health: await getSpriteImage(camera, "assets/images/ui/health.png"),
        mapData: await getObjectFromJson("map.json")
    };
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
class Game {
    camera;
    controller;
    map;
    player;
    resources;
    constructor(){
        console.log("Hi");
        (async ()=>{
            const camera = this.camera = new Camera(document.querySelector("canvas"), 3);
            this.controller = new Controller(this.camera);
            this.resources = await loadResources(this.camera);
            this.map = new Map(this.camera, this.resources.mapSprite, this.resources.mapData, this.controller);
            let spawnPoints = this.map.data.spawnPoints;
            let randomSpwanIndex = Math.floor(Math.random() * spawnPoints.length);
            this.player = new Player(this.camera, this.resources.playerSprite, this.map, spawnPoints[randomSpwanIndex]);
            let lastFrameTime = 0;
            const gameLoop = (progress)=>{
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
        let getSpeed = ()=>this.controller.isKeyDown("shift") ? 2 : 1
        ;
        let getLastWalkKey = ()=>this.controller.getLastDownKeyFrom("w", "a", "s", "d")
        ;
        if (getLastWalkKey() === "w") {
            this.player.walk(Direction.Up, getSpeed, ()=>getLastWalkKey() !== "w"
            );
        }
        if (getLastWalkKey() === "a") {
            this.player.walk(Direction.Left, getSpeed, ()=>getLastWalkKey() !== "a"
            );
        }
        if (getLastWalkKey() === "s") {
            this.player.walk(Direction.Down, getSpeed, ()=>getLastWalkKey() !== "s"
            );
        }
        if (getLastWalkKey() === "d") {
            this.player.walk(Direction.Right, getSpeed, ()=>getLastWalkKey() !== "d"
            );
        }
        while(!this.controller.mouseActions.isEmpty){
            let action = this.controller.mouseActions.dequeue();
            if (action.type === "wheel") {
                this.camera.scale = Math.max(2, Math.min(5, this.camera.scale + (action.up ? 1 : -1)));
            }
        }
    }
    render() {
        const canvas = this.camera.canvas;
        this.map?.draw(()=>{
            this.player?.draw();
        });
        for(let i = -4; i <= 4; i++){
            this.resources?.slot.drawAtUICentered(this.camera.width / 2 + i * 19, this.camera.height - 12);
        }
        new ItemRenderer(this.resources.emerald, 100).drawAtUICentered(this.camera.width / 2, this.camera.height - 12);
        let cursorPosition = this.controller.cursorPosition;
        this.resources?.cursor.drawAtUI(cursorPosition.x * (this.camera.width / canvas.clientWidth), cursorPosition.y * (this.camera.height / canvas.clientHeight));
    }
}
new Game();
