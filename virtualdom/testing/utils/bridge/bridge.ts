import { VirtualBridge } from "../../../bridge/abstract.js";
import { Mutation } from "../../../mutations/types.js";

export class TestingVirtualBridge<NodeID> implements VirtualBridge<NodeID> {
    sendPatch(patch: Mutation<NodeID>): void {
        this.patches.push(patch);
    }

    constructor () {
        this.patches = [];
    }
    patches: Mutation<NodeID>[];
}
