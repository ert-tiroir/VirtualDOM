import { Channel } from "./channel.js";

export abstract class Transceiver {
    channels: { [key: string]: Channel };

    constructor () {
        this.channels = {};
    }
    registerChannel (channel: Channel) {
        this.channels[channel.name] = channel;

        channel.transceiver = this;
    }

    onMessage (message: string) {
        let index = message.indexOf("$");
        let name  = message.substring(0, index);
        let tmsg  = message.substring(index + 1);

        this.channels[name]?.callback(tmsg);
    }
    abstract sendMessage (message: string): void;
    abstract listen (): void;

}

export class WindowTransceiver extends Transceiver {
    sendMessage(message: string) {
        this.worker.postMessage(message);
    }
    listen() {
        this.worker.onmessage = (event) => {
            this.onMessage(event.data as string);
        }
    }
    private worker: Worker;

    constructor (worker: Worker) {
        super();
        this.worker = worker;

        this.listen();
    }
}

export class WorkerTransceiver extends Transceiver {
    constructor () {
        super();
        this.listen();
    }

    sendMessage(message: string): void {
        postMessage(message);
    }
    listen(): void {
        self.onmessage = (event) => this.onMessage(event.data as "string");
    }

}
