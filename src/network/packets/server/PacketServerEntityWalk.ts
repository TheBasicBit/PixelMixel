import Direction from "../../../render/Direction.ts";
import Packet from "../Packet.ts";

export default interface PacketServerEntityWalk extends Packet {
    entityId: number;
    direction: Direction;
    speed: number;
    x: number;
    y: number;
}