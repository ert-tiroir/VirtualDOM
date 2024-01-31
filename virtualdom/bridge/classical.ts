import { Mutation, MutationPatcher } from "virtualdom/mutations/types.js";
import { DOMBridge, VirtualBridge } from "./abstract.js";
import { EventSubscribable } from "virtualdom/events/subscribable.js";
import { EventEngine } from "virtualdom/virtual/events/target.js";

class ClassicalVirtualBridge<NodeID> implements VirtualBridge<NodeID> {
    domBridge: ClassicalDOMBridge<NodeID>;
    eventEngine: EventEngine<NodeID>;

    constructor (eventEngine: EventEngine<NodeID>) {
        this.eventEngine = eventEngine;
    }

    subscribe(event: string, target: NodeID): void {
        this.domBridge.subscribe(event, target);
    }
    unsubscribe(event: string, target: NodeID): void {
        this.domBridge.unsubscribe(event, target);
    }
    
    sendPatch(patch: Mutation<NodeID>): void {
        this.domBridge.sendPatch(patch);
    }
    dispatchEvent (id: NodeID, target: string, event: Event) {
        this.eventEngine.dispatchEvent(target, id, event);
    }
}

class ClassicalDOMBridge<NodeID> implements DOMBridge<NodeID> {
    virtualBridge: ClassicalVirtualBridge<NodeID>;
    patcher:       MutationPatcher<NodeID>;
    subscriber:    EventSubscribable<NodeID, Node>;

    constructor (patcher: MutationPatcher<NodeID>, subscriber: EventSubscribable<NodeID, Node>) {
        this.patcher = patcher;

        this.subscriber = subscriber;
        subscriber.setCallback((id: NodeID, target: string, event: Event) => this.onevent(id, target, event))
    }

    onevent (id: NodeID, target: string, event: Event) {
        this.virtualBridge.dispatchEvent(id, target, event);
    }
    subscribe (event: string, target: NodeID): void {
        let element = this.patcher.getElement(target);
        if (element === undefined) return ;

        this.subscriber.subscribe(target, element, event);
    }
    unsubscribe (event: string, target: NodeID): void {
        let element = this.patcher.getElement(target);
        if (element === undefined) return ;

        this.subscriber.unsubscribe(target, element, event);
    }

    sendPatch (patch: Mutation<NodeID>) {
        this.patcher.apply(patch);
    }
}

export function createClassicalBridge<NodeID> (eventEngine: EventEngine<NodeID>, patcher: MutationPatcher<NodeID>, subscribable: EventSubscribable<NodeID, Node>): [ VirtualBridge<NodeID>, DOMBridge<NodeID> ] {
    let cvb = new ClassicalVirtualBridge<NodeID>(eventEngine);
    let cdb = new ClassicalDOMBridge<NodeID>(patcher, subscribable);

    cvb.domBridge     = cdb;
    cdb.virtualBridge = cvb;

    return [ cvb, cdb ];
}
