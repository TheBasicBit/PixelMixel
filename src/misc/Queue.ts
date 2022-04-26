export default class Queue<T> {
    elements: { [key: number]: T } = {};

    head = 0;
    tail = 0;

    constructor() {
        this.elements = {};
    }

    enqueue(element: T) {
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