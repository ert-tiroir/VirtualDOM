import { Transceiver } from "./transceiver";

export class Channel {
    name: string;
    callback: (data: string) => void;

    transceiver: Transceiver;

    constructor (name: string, callback: (data: string) => void) {
        this.name     = btoa(name);
        this.callback = callback;
    }

    postMessage (data: any) {
        let str: string;
        if (!(typeof data === "string" || data instanceof String)) str = JSON.stringify(data);
        else str = data as string;
        
        this.transceiver.sendMessage(this.name + "$" + str);
    }
}
