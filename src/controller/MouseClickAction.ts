import MouseAction from "./MouseAction.ts";

export default interface MouseClickAction extends MouseAction {
    type: "left" | "right" | "middle",
    x: number,
    y: number
}
