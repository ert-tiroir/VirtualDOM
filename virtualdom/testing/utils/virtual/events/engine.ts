
import { DocumentType } from "../../../../virtual/document.js";
import { VirtualEvent, EventType, IEventEngine } from "../../../../virtual/events/types.js";
import { Node } from "../../../../virtual/tree/node.js";

export class TestingEventEngine implements IEventEngine<number, Node<number, DocumentType<number>>> {
    subscribe(_type: EventType, _target: Node<number, DocumentType<number>>): void {
    }
    unsubscribe(_type: EventType, _target: Node<number, DocumentType<number>>): void {
    }
    dispatchEvent(_type: EventType, _id: number, _event: VirtualEvent<number>): void {
    }

}
