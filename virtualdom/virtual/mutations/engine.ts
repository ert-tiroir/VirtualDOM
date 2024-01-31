import { VirtualBridge } from "../../bridge/abstract.js";
import { AppendChildMutationData, CallProperty, CreateNodeMutationData, DeleteNodeMutationData, InsertBeforeMutationData, Mutation, MutationType, RemoveChildMutationData, ReplaceChildMutationData, SetProperty } from "../../mutations/types.js";

export abstract class MutationEngine<NodeID extends number | string | symbol> {
    abstract next (current: NodeID): NodeID;
    abstract default (): NodeID;

    private local:  NodeID;
    private bridge: VirtualBridge<NodeID>;
    private nodes: Record<NodeID, any>;
    private send (data: Mutation<NodeID>): void {
        this.bridge.sendPatch(data);
    }

    constructor (bridge: VirtualBridge<NodeID>) {
        this.local = this.default();

        this.bridge = bridge;
        this.nodes  = {} as Record<NodeID, any>;
    }

    getNode (id: NodeID): any {
        return this.nodes[id];
    }

    createNode (tag: string, node: any): NodeID {
        let id = this.local;
        this.local = this.next(this.local);

        let data: CreateNodeMutationData<NodeID> = { id: id, tag: tag };
        this.send({ type: MutationType.CREATE_NODE, ...data });

        this.nodes[id] = node;

        return id;
    }
    deleteNode (id: NodeID): void {
        let data: DeleteNodeMutationData<NodeID> = { id: id };
        this.send({ type: MutationType.DELETE_NODE, ...data });
    }
    appendChild (parent: NodeID, child: NodeID): void {
        let data: AppendChildMutationData<NodeID> = { parent: parent, child: child };
        this.send({ type: MutationType.APPEND_CHILD, ...data });
    }
    removeChild (parent: NodeID, child: NodeID): void {
        let data: RemoveChildMutationData<NodeID> = { parent: parent, child: child };
        this.send({ type: MutationType.REMOVE_CHILD, ...data });
    }
    insertBefore (parent: NodeID, newNode: NodeID, reference: NodeID): void {
        let data: InsertBeforeMutationData<NodeID> = { parent, newNode, reference };
        this.send({ type: MutationType.INSERT_BEFORE, ...data });
    }
    replaceChild (parent: NodeID, node: NodeID, child: NodeID): void {
        let data: ReplaceChildMutationData<NodeID> = { parent: parent, newChild: node, oldChild: child };
        this.send({ type: MutationType.REPLACE_CHILD, ...data });
    }
    setProperty (node: NodeID, path: string[], value: any): void {
        let data: SetProperty<NodeID> = { id: node, path: path, value: value };
        this.send({ type: MutationType.SET_PROPERTY, ...data });
    }
    callProperty (node: NodeID, path: string[], args: any[]): void {
        let data: CallProperty<NodeID> = { id: node, path: path, args: args };
        this.send({ type: MutationType.CALL_PROPERTY, ...data });
    }
}
