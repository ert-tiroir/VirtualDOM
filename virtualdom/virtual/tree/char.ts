
import { EventEngine } from "../events/target.js";
import { MutationEngine } from "../mutations/engine.js";
import { Node } from "./node.js";

export class CharacterData<NodeID, DocumentType extends Node<NodeID, DocumentType>> extends Node<NodeID, DocumentType> {
    private data_: string;
    
    constructor (mutationEngine: MutationEngine<NodeID>, eventEngine: EventEngine, document?: DocumentType) {
        super(mutationEngine, eventEngine, "#text", document); 

        this.data_ = "";
    }

    get data () {
        return this.data_;
    }
    set data (value: string) {
        this.data_ = value;

        this.mutationEngine.setProperty(this.index, [ "data" ], value);
    }
    get length () {
        return this.data_.length;
    }

    appendChild(_: Node<NodeID, DocumentType>): void {
        throw new DOMException("Node.appendChild: Cannot add children to a CharacterData", "HierarchyRequestError");
    }
    removeChild(_: Node<NodeID, DocumentType>): void {
        throw new DOMException("Node.removeChild: Cannot remove a children from a CharacterData", "HierarchyRequestError");
    }
    insertBefore(_1: Node<NodeID, DocumentType>, _2: Node<NodeID, DocumentType>): void {
        throw new DOMException("Node.insertBefore: Cannot insert a children to a CharacterData", "HierarchyRequestError");
    }
    replaceChild(_1: Node<NodeID, DocumentType>, _2: Node<NodeID, DocumentType>): void {
        throw new DOMException("Node.replaceChild: Cannot replace a children of a CharacterData", "HierarchyRequestError");
    }
    contains(_: Node<NodeID, DocumentType>): boolean {
        return false;
    }
    hasChildNodes(): boolean {
        return false;
    }
}
