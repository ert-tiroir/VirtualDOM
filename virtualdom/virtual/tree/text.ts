import { EventEngine } from "../events/target.js";
import { MutationEngine } from "../mutations/engine.js";
import { CharacterData } from "./char.js";
import { Node } from "./node.js";

export class Text<NodeID extends number | string | symbol, DocumentType extends Node<NodeID, DocumentType>> extends CharacterData<NodeID, DocumentType> {
    constructor (text: string | undefined, mutationEngine: MutationEngine<NodeID>, eventEngine: EventEngine<NodeID>, document?: DocumentType) {
        super(mutationEngine, eventEngine, document);

        if (text !== undefined)
            this.data = text;
    }
}
