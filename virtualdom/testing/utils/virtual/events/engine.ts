
import { DocumentType } from "virtualdom/virtual/document.js";
import { Event, EventType, IEventEngine } from "virtualdom/virtual/events/types.js";
import { Node } from "virtualdom/virtual/tree/node.js";

export class TestingEventEngine implements IEventEngine<Node<number, DocumentType<number>>> {
    subscribe(type: EventType, target: Node<number, DocumentType<number>>): void {
        console.log(type, target);
    }
    unsubscribe(type: EventType, target: Node<number, DocumentType<number>>): void {
        console.log(type, target);
    }
    dispatchEvent(type: EventType, event: Event): void {
        console.log(type, event);
    }

}
