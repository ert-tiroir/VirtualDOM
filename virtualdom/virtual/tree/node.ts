
import { EventEngine, EventTarget } from "../events/target.js";
import { MutationEngine } from "../mutations/engine.js";
import { INode, NodeType } from "./types.js";

function checkWhiteSpace (value: string): boolean {
    return /\s/g.test(value);
}
export class VClassList {
    private list: string[];
    private call: (path: string[], args:  any[]) => void;

    constructor (list: string[], call: (path: string[], args: any[]) => void) {
        this.list = list;

        this.call = call;

        return new Proxy(this, {
            get: (target, p, receiver) => {
                let num = new Number(p).valueOf();
                if (!isNaN(num))
                    return this.list[num];

                return Reflect.get(target, p, receiver);
            }
        })
    }

    get length () {
        return this.list.length;
    }

    add (clazz: string) {
        if (checkWhiteSpace(clazz))
            throw new DOMException("DOMTokenList.add: The token can not contain whitespace.", "InvalidCharacterError");

        this.list.push(clazz);
        this.call([ "classList", "add" ], [ clazz ])
    }
    remove (clazz: string) {
        if (checkWhiteSpace(clazz))
            throw new DOMException("DOMTokenList.remove: The token can not contain whitespace.", "InvalidCharacterError");

        let index = this.list.indexOf(clazz);
        if (index === -1) return ;

        this.list.splice(index, 1);
        this.call([ "classList", "remove" ], [ clazz ])
    }
}

export class Node<NodeID extends number | string | symbol, DocumentType extends Node<NodeID, DocumentType>> extends EventTarget<NodeID>
       implements INode<NodeID, Node<NodeID, DocumentType>, DocumentType> {
    
    readonly index : NodeID;

    private document_      : DocumentType;
    private parentNode_    : Node<NodeID, DocumentType> | null;
    private indexInParent_ : number;
    private childNodes_    : Node<NodeID, DocumentType>[];

    private readonly nodeName_ : string;
    private readonly nodeType_ : NodeType;

    protected readonly mutationEngine : MutationEngine<NodeID>;

    private classNames_: string[];
    private classList_: VClassList; 

    constructor (mutationEngine: MutationEngine<NodeID>, 
                 eventEngine: EventEngine<NodeID>, 
                 tag: string, document?: DocumentType) {
        super(eventEngine);

        this.mutationEngine = mutationEngine;

        if (document !== undefined) this.document_ = document;

        this.classNames_ = [];
        this.classList_  = new VClassList(this.classNames_,
            (path: string[], args: any[]) => this.mutationEngine.callProperty(this.index, path, args));

        this.childNodes_ = [];
        this.unbindParent();

        this.nodeName_ = tag;
        this.index     = this.mutationEngine.createNode(tag, this);
    }
    protected setDocument (document: DocumentType) {
        this.document_ = document;
    }

    private getSibling (delta: number): Node<NodeID, DocumentType> | null {
        if (this.parentNode_ === null) return null;

        let childs    = this.parentNode_.childNodes_;
        let siblingID = this.indexInParent_ + delta;
        if (siblingID < 0 || siblingID >= childs.length) return null;

        let child = childs[siblingID];
        if (child === undefined) return null;

        return child;
    }

    get className (): string {
        let array = [];
        for (let clazz of this.classNames_) array.push(clazz);

        return array.join(" ");
    }
    set className (value: string) {
        while (this.classNames_.length != 0) this.classNames_.pop();

        for (let clazz of value.split(" ")) this.classNames_.push(clazz);

        this.mutationEngine.setProperty(this.index, [ "className" ], value);
    }

    get classList () {
        return this.classList_;
    }

    get ownerDocument(): DocumentType {
        return this.document_;
    }
    get parentElement(): Node<NodeID, DocumentType> | null {
        return this.parentNode_;
    }
    get childsNodes(): readonly Node<NodeID, DocumentType>[] {
        return this.childNodes_;
    }
    get firstChild(): Node<NodeID, DocumentType> | null {
        if (this.childNodes_.length === 0) return null;

        let child = this.childNodes_[0];
        if (child === undefined) return null;
        return child;
    }
    get lastChild(): Node<NodeID, DocumentType> | null {
        if (this.childNodes_.length === 0) return null;

        let child = this.childNodes_[this.childNodes_.length - 1];
        if (child === undefined) return null;
        return child;
    }
    get nextSibling(): Node<NodeID, DocumentType> | null {
        return this.getSibling(1);
    }
    get previousSibling(): Node<NodeID, DocumentType> | null {
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
    private bindParent (parent: Node<NodeID, DocumentType>, index: number) {
        this.parentNode_    = parent;
        this.indexInParent_ = index;
    }
    private removeFromParent () {
        if (this.parentNode_ === null) return ;

        this.parentNode_.removeChild(this);
    }

    appendChild(child: Node<NodeID, DocumentType>): void {
        if (child.contains(this))
            throw new DOMException("Node.appendChild: The new child is an ancestor of the parent", "HierarchyRequestError");
    
        if (child.parentNode_ !== null)
            child.parentNode_.removeChild(child);
        
        child.bindParent( this, this.childNodes_.length );

        this.childNodes_.push(child);

        this.mutationEngine.appendChild(this.index, child.index);
    }
    contains(other: Node<NodeID, DocumentType>): boolean {
        let checking: Node<NodeID, DocumentType> | null = other;

        while (checking !== null) {
            if (checking === this) return true;

            checking = checking.parentNode_;
        }

        return false;
    }
    getRootNode(): Node<NodeID, DocumentType> {
        if (this.parentNode_ === null) return this;

        return this.parentNode_.getRootNode();
    }
    hasChildNodes(): boolean {
        return this.childNodes_.length !== 0;
    }
    isSameNode(other: Node<NodeID, DocumentType>): boolean {
        return this === other;
    }
    removeChild(child: Node<NodeID, DocumentType>): void {
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

        this.mutationEngine.removeChild(this.index, child.index);
    }
    insertBefore(newNode: Node<NodeID, DocumentType>, referenceNode: Node<NodeID, DocumentType>): void {
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

        this.mutationEngine.insertBefore(this.index, newNode.index, referenceNode.index);
    }
    replaceChild(newChild: Node<NodeID, DocumentType>, oldChild: Node<NodeID, DocumentType>): void {
        if (oldChild.parentNode_ !== this)
            throw new DOMException("Node.replaceChild: Child to be replaced is not a child of this node", "NotFoundError");
        if (newChild.contains(this))
            throw new DOMException("Node.replaceChild: The new child is an ancestor of the parent", "HierarchyRequestError");

        newChild.removeFromParent();

        newChild.parentNode_    = this;
        newChild.indexInParent_ = oldChild.indexInParent_;

        this.childNodes_[newChild.indexInParent_] = newChild;

        oldChild.unbindParent();

        this.mutationEngine.replaceChild(this.index, newChild.index, oldChild.index);
    }
}
