import { VirtualBridge } from "../../../bridge/abstract.js";
import { Mutation } from "../../../mutations/types.js";

export class TestingVirtualBridge<NodeID> implements VirtualBridge<NodeID> {
    sendPatch(patch: Mutation<NodeID>): void {
        this.patches.push(patch);
    }

    constructor () {
        this.patches = [];
    }
    subscribe(_1: string, _2: NodeID): void {
        throw new Error("Method not implemented.");
    }
    unsubscribe(_1: string, _2: NodeID): void {
        throw new Error("Method not implemented.");
    }
    patches: Mutation<NodeID>[];
}
