import MouseAction from "./MouseAction.ts";

export default interface MouseWheelAction extends MouseAction {
    type: "wheel",
    up: boolean
}