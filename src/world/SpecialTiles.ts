export default class ControlTiles {
    
    static get barriers() {
        return {
            leftFull: 16,
            rightFull: 18,
            topFull: 1,
            bottomFull: 33,

            leftTopFull: 0,
            leftBottomFull: 32,
            rightTopFull: 2,
            rightBottomFull: 34,

            leftTop: 6,
            leftBottom: 22,
            rightTop: 7,
            rightBottom: 23,

            full: 17
        }
    }

    static get barrierList() {
        return Object.values(this.barriers);
    }

    static isBlockPointSolid(tileId: number, x: number, y: number) {
        if (tileId === this.barriers.full) {
            return true;
        }

        return this.barrierList.includes(tileId) && (
            (tileId === this.barriers.leftFull && x <= 8) ||
            (tileId === this.barriers.rightFull && x > 8) ||
            (tileId === this.barriers.topFull && y <= 8) ||
            (tileId === this.barriers.bottomFull && y > 8) ||

            (tileId === this.barriers.leftTopFull && (x <= 8 || y <= 8)) ||
            (tileId === this.barriers.leftBottomFull && (x <= 8 || y > 8)) ||
            (tileId === this.barriers.rightTopFull && (x > 8 || y <= 8)) ||
            (tileId === this.barriers.rightBottomFull && (x > 8 || y > 8)) ||

            (tileId === this.barriers.leftTop && (x <= 8 && y <= 8)) ||
            (tileId === this.barriers.leftBottom && (x <= 8 && y > 8)) ||
            (tileId === this.barriers.rightTop && (x > 8 && y <= 8)) ||
            (tileId === this.barriers.rightBottom && (x > 8 && y > 8))
        );
    }

    static get spawn() {
        return 3;
    }
    
    static get waterTiles() {
        return {
            waterFunction: 20,
            waterAnimation: [63, 79, 95]
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