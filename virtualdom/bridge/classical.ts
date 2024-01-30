import { Mutation, MutationPatcher } from "virtualdom/mutations/types.js";
import { DOMBridge, VirtualBridge } from "./abstract.js";

class ClassicalVirtualBridge<NodeID> implements VirtualBridge<NodeID> {
    domBridge: ClassicalDOMBridge<NodeID>;

    constructor () {}
    
    sendPatch(patch: Mutation<NodeID>): void {
        this.domBridge.sendPatch(patch);
    }
}

class ClassicalDOMBridge<NodeID> implements DOMBridge {
    virtualBridge: ClassicalVirtualBridge<NodeID>;
    patcher: MutationPatcher<NodeID>;

    constructor (patcher: MutationPatcher<NodeID>) {
        this.patcher = patcher;
    }

    sendPatch (patch: Mutation<NodeID>) {
        this.patcher.apply(patch);
    }
}

export function createClassicalBridge<NodeID> (patcher: MutationPatcher<NodeID>): [ VirtualBridge<NodeID>, DOMBridge ] {
    let cvb = new ClassicalVirtualBridge<NodeID>();
    let cdb = new ClassicalDOMBridge<NodeID>(patcher);

    cvb.domBridge     = cdb;
    cdb.virtualBridge = cvb;

    return [ cvb, cdb ];
}
