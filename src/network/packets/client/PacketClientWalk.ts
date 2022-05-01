import Direction from "../../../render/Direction.ts";
import Packet from "../Packet.ts";

export default class PacketClientWalk implements Packet {

    packetType: string;
    direction: Direction;
    speed: number;
    x: number;
    y: number;

    constructor(direction: Direction, speed: number, x: number, y: number) {
        this.packetType = "PacketClientWalk";
        this.direction = direction;
        this.speed = speed;
        this.x = x;
        this.y = y;
    }

}