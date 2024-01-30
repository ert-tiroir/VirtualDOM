import { Mutation } from "../mutations/types.js";

export interface VirtualBridge<NodeID> {
    sendPatch (patch: Mutation<NodeID>): void;
}

export interface DOMBridge {
    
}
