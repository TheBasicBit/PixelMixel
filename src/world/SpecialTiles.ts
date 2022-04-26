export default class ControlTiles {
    
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
        return 137;
    }
    
    static get water() {
        return 138;
    }
    
    static get all() {
        return [
            ...this.barrierList,
            this.spawn,
            this.water
        ];
    }
}