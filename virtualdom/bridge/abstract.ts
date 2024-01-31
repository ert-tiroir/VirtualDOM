import { EventType } from "../virtual/events/types.js";
import { Mutation } from "../mutations/types.js";

export interface VirtualBridge<NodeID> {
    sendPatch (patch: Mutation<NodeID>): void;

    subscribe   (event: EventType, target: NodeID): void;
    unsubscribe (event: EventType, target: NodeID): void;
}

export interface DOMBridge<_NodeID> {}
