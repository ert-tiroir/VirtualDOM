import { EventSubscribable } from "./subscribable.js";

export class DOMSubscribable<NodeID> implements EventSubscribable<NodeID, Node> {
    callback  : any;
    setCallback(callback: any): void {
        this.callback = callback;
    }
    
    subscribe(id: NodeID, node: Node, target: string): void {
        (node as any)["__listener_" + target] = (event: Event) => { this.callback(id, target, event); }

        node.addEventListener(target, (node as any)["__listener_" + target]);
    }
    unsubscribe(_id: NodeID, node: Node, target: string): void {
        node.removeEventListener(target, (node as any)["__listener_" + target]);
    }
}
