
import { DocumentType } from "virtualdom/virtual/document.js";
import { Event, EventType, IEventEngine } from "virtualdom/virtual/events/types.js";
import { Node } from "virtualdom/virtual/tree/node.js";

export class TestingEventEngine implements IEventEngine<Node<DocumentType>> {
    subscribe(type: EventType, target: Node<DocumentType>): void {
        throw new Error("Method not implemented.");
    }
    unsubscribe(type: EventType, target: Node<DocumentType>): void {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(type: EventType, event: Event): void {
        throw new Error("Method not implemented.");
    }

}
