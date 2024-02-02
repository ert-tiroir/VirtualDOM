import { VirtualEvent, IEventEngine } from "./types.js";
import { Node }  from "../tree/node.js";
import { DocumentType } from "../document.js";
import { VirtualBridge } from "../../bridge/abstract.js";

export class BridgeEngine<NodeID extends string | number | symbol> implements IEventEngine<NodeID, Node<NodeID, DocumentType<NodeID>>> {
    private bridge:  VirtualBridge<NodeID>;
    private objects: Record<NodeID, Node<NodeID, DocumentType<NodeID>>>;

    constructor () {
        this.objects = {} as Record<NodeID, Node<NodeID, DocumentType<NodeID>>>;
    }

    useBridge (bridge: VirtualBridge<NodeID>) {
        this.bridge = bridge;
    }
    
    subscribe(type: string, target: Node<NodeID, any>): void {
        this.bridge.subscribe(type, target.index);

        this.objects[target.index] = target;
    }
    unsubscribe(type: string, target: Node<NodeID, any>): void {
        this.bridge.unsubscribe(type, target.index);

        this.objects[target.index] = target;
    }
    dispatchEvent(type: string, id: NodeID, event: VirtualEvent<NodeID>): void {
        let target = this.objects[id];
        if (target === undefined) return ;

        target.dispatchEvent(type, event);
    }
}
