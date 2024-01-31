
import { IEventTarget } from "../events/types.js";

/* BASE OBJECTS */

export enum NodeType {
    ELEMENT_NODE                 = 1,
    ATTRIBUTE_NODE               = 2,
    TEXT_NODE                    = 3,
    CDATA_SECTION_NODE           = 4,
    PROCESSING_INSTRUCTION_NODE  = 7,
    COMMENT_NODE                 = 8,
    DOCUMENT_NODE                = 9,
    DOCUMENT_TYPE_NODE           = 10,
    DOCUMENT_FRAGMENT_NODE       = 11
}

export interface INode<NodeID, SelfType extends INode<NodeID, SelfType, DocumentType>, DocumentType extends INode<NodeID, SelfType, DocumentType>> extends IEventTarget<NodeID> {
    get ownerDocument (): DocumentType;
    get parentElement (): SelfType | null;

    get childsNodes     (): readonly SelfType[];
    get firstChild      (): SelfType | null;
    get lastChild       (): SelfType | null;
    get nextSibling     (): SelfType | null;
    get previousSibling (): SelfType | null;

    get baseURI     (): string;
    get isConnected (): boolean;
    get nodeType    (): NodeType;
    get nodeValue   (): string | null;
    get nodeName    (): string;
    get textContent (): string;

    set nodeValue   (value: string | null);
    set textContent (value: string);

    contains      (other: SelfType) : boolean;
    getRootNode   () : SelfType;
    hasChildNodes () : boolean;
    isSameNode    (other: SelfType) : boolean;

    removeChild  (child: SelfType) : void;
    appendChild  (child: SelfType) : void;
    insertBefore (newNode:  SelfType, referenceNode: SelfType) : void;
    replaceChild (newChild: SelfType, oldChild     : SelfType) : void;
}
