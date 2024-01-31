import { RegisteredMutationPatcher } from "./registered.js";

export class DOMMutationPatcher extends RegisteredMutationPatcher<number> {
    nodes    : { [key: number]: Node | undefined };
    document : Element;

    constructor (document: Element) {
        super();
        
        this.nodes    = {};
        this.document = document;
    }

    createElement(id: number, tag: string): void {
        if (id == 0) this.nodes[id] = this.document;
        else if (tag === "#text") this.nodes[id] = document.createTextNode("");
        else this.nodes [id] = document.createElement(tag);

        let node = this.nodes[id];
        if (node !== undefined)
            (node as any).nodeID = id;
    }
    deleteElement(id: number): void {
        this.nodes [id] = undefined;
    }
    getElement(id: number): Node | undefined {
        return this.nodes[id];
    }
}
