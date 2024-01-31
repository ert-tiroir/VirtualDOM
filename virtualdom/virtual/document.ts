import { IEventEngine } from "./events/types.js";
import { MutationEngine } from "./mutations/engine.js";
import { Node } from "./tree/node.js";
import { Text } from "./tree/text.js";

export class DocumentType<NodeID extends number | string | symbol> extends Node<NodeID, DocumentType<NodeID>> {
    constructor (mutationEngine: MutationEngine<NodeID>, engine: IEventEngine<NodeID, Node<NodeID, DocumentType<NodeID>>>, baseURI: string) {
        super(mutationEngine, engine, "document");

        this.setDocument(this);
        this.baseURI_ = baseURI;
    }
    private baseURI_: string;

    createElement (tag: string): Node<NodeID, DocumentType<NodeID>> {
        let node = new Node<NodeID, DocumentType<NodeID>>(this.mutationEngine, this.engine, tag, this);
        
        return node;
    }
    createTextElement (data?: string): Node<NodeID, DocumentType<NodeID>> {
        return new Text<NodeID, DocumentType<NodeID>>(data, this.mutationEngine, this.engine, this);
    }

    override get isConnected (): boolean { return true;          }
    override get baseURI     (): string  { return this.baseURI_; }
}
