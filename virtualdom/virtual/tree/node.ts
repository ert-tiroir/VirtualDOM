
import { EventEngine, EventTarget } from "../events/target.js";
import { INode, NodeType } from "./types.js";

export class Node<DocumentType extends Node<DocumentType>> extends EventTarget
       implements INode<Node<DocumentType>, DocumentType> {
    
    private document_      : DocumentType;
    private parentNode_    : Node<DocumentType> | null;
    private indexInParent_ : number;
    private childNodes_    : Node<DocumentType>[];

    private readonly nodeName_ : string;
    private readonly nodeType_ : NodeType;

    constructor (engine: EventEngine, document?: DocumentType) {
        super(engine);

        if (document !== undefined) this.document_ = document;

        this.childNodes_ = [];
        this.unbindParent();
    }
    protected setDocument (document: DocumentType) {
        this.document_ = document;
    }

    private getSibling (delta: number): Node<DocumentType> | null {
        if (this.parentNode_ === null) return null;

        let childs    = this.parentNode_.childNodes_;
        let siblingID = this.indexInParent_ + delta;
        if (siblingID < 0 || siblingID >= childs.length) return null;

        let child = childs[siblingID];
        if (child === undefined) return null;

        return child;
    }

    get ownerDocument(): DocumentType {
        return this.document_;
    }
    get parentElement(): Node<DocumentType> | null {
        return this.parentNode_;
    }
    get childsNodes(): readonly Node<DocumentType>[] {
        return this.childNodes_;
    }
    get firstChild(): Node<DocumentType> | null {
        if (this.childNodes_.length === 0) return null;

        let child = this.childNodes_[0];
        if (child === undefined) return null;
        return child;
    }
    get lastChild(): Node<DocumentType> | null {
        if (this.childNodes_.length === 0) return null;

        let child = this.childNodes_[this.childNodes_.length - 1];
        if (child === undefined) return null;
        return child;
    }
    get nextSibling(): Node<DocumentType> | null {
        return this.getSibling(1);
    }
    get previousSibling(): Node<DocumentType> | null {
        return this.getSibling(-1);
    }
    get baseURI(): string {
        return this.document_.baseURI;
    }
    get isConnected(): boolean {
        if (this.parentNode_ === null) return false;

        return this.parentNode_.isConnected;
    }
    get nodeType(): NodeType {
        return this.nodeType_;
    }
    get nodeValue(): string | null {
        throw new Error("Method not implemented.");
    }
    set nodeValue(value: string | null) {
        throw new Error("Method not implemented." + value);
    }
    get nodeName(): string {
        return this.nodeName_;
    }
    get textContent(): string {
        throw new Error("Method not implemented.");
    }
    set textContent(value: string) {
        throw new Error("Method not implemented." + value);
    }

    private unbindParent () {
        this.parentNode_    = null;
        this.indexInParent_ = -1;
    }
    private bindParent (parent: Node<DocumentType>, index: number) {
        this.parentNode_    = parent;
        this.indexInParent_ = index;
    }
    private removeFromParent () {
        if (this.parentNode_ === null) return ;

        this.parentNode_.removeChild(this);
    }

    appendChild(child: Node<DocumentType>): void {
        if (child.contains(this))
            throw new DOMException("Node.appendChild: The new child is an ancestor of the parent", "HierarchyRequestError");
    
        if (child.parentNode_ !== null)
            child.parentNode_.removeChild(child);
        
        child.bindParent( this, this.childNodes_.length );

        this.childNodes_.push(child);
    }
    contains(other: Node<DocumentType>): boolean {
        let checking: Node<DocumentType> | null = other;

        while (checking !== null) {
            if (checking === this) return true;

            checking = checking.parentNode_;
        }

        return false;
    }
    getRootNode(): Node<DocumentType> {
        if (this.parentNode_ === null) return this;

        return this.parentNode_.getRootNode();
    }
    hasChildNodes(): boolean {
        return this.childNodes_.length !== 0;
    }
    isSameNode(other: Node<DocumentType>): boolean {
        return this === other;
    }
    removeChild(child: Node<DocumentType>): void {
        if (child.parentNode_ !== this)
            throw new DOMException("Node.removeChild: The node to be removed is not a child of this node", "NotFoundError");
    
        let index = child.indexInParent_;

        child.unbindParent();

        this.childNodes_.splice(index, 1);
        for (let i = index; i < this.childNodes_.length; i ++) {
            let child = this.childNodes_[i];
            if (child === undefined) continue ;

            child.indexInParent_ = i;
        }
    }
    insertBefore(newNode: Node<DocumentType>, referenceNode: Node<DocumentType>): void {
        if (referenceNode.parentNode_ !== this)
            throw new DOMException("Node.insertBefore: Reference node is not a child of this node", "NotFoundError");
        if (newNode.contains(this))
            throw new DOMException("Node.insertBefore: Child to insert before is not a child of this node", "NotFoundError");
        
        newNode.removeFromParent();

        let index = referenceNode.indexInParent_;
        newNode.bindParent(this, index);

        this.childNodes_.splice(index, 0, newNode);
        
        for (let i = index + 1; i < this.childNodes_.length; i ++) {
            let child = this.childNodes_[i];
            if (child === undefined) continue ;

            child.indexInParent_ = i;
        }
    }
    replaceChild(newChild: Node<DocumentType>, oldChild: Node<DocumentType>): void {
        if (oldChild.parentNode_ !== this)
            throw new DOMException("Node.replaceChild: Child to be replaced is not a child of this node", "NotFoundError");
        if (newChild.contains(this))
            throw new DOMException("Node.replaceChild: The new child is an ancestor of the parent", "HierarchyRequestError");

        newChild.removeFromParent();

        newChild.parentNode_    = this;
        newChild.indexInParent_ = oldChild.indexInParent_;

        this.childNodes_[newChild.indexInParent_] = newChild;

        oldChild.unbindParent();
    }
}
