import { IEventEngine } from "./events/types.js";
import { Node } from "./tree/node.js";

export class DocumentType extends Node<DocumentType> {
    constructor (engine: IEventEngine<Node<DocumentType>>, baseURI: string) {
        super(engine);

        this.setDocument(this);
        this.baseURI_ = baseURI;
    }
    private baseURI_: string;

    createElement (): Node<DocumentType> {
        let node = new Node<DocumentType>(this.engine, this);
        
        return node;
    }

    override get isConnected (): boolean { return true;          }
    override get baseURI     (): string  { return this.baseURI_; }
}
