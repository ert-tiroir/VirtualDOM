import { VirtualBridge } from "../../bridge/abstract.js";
import { AppendChildMutationData, CreateNodeMutationData, DeleteNodeMutationData, InsertBeforeMutationData, Mutation, MutationType, RemoveChildMutationData, ReplaceChildMutationData, SetProperty } from "../../mutations/types.js";

export abstract class MutationEngine<NodeID> {
    abstract next (current: NodeID): NodeID;
    abstract default (): NodeID;

    private local:  NodeID;
    private bridge: VirtualBridge<NodeID>;
    private send (data: Mutation<NodeID>): void {
        this.bridge.sendPatch(data);
    }

    constructor (bridge: VirtualBridge<NodeID>) {
        this.local = this.default();

        this.bridge = bridge;
    }

    createNode (tag: string): NodeID {
        let id = this.local;
        this.local = this.next(this.local);

        let data: CreateNodeMutationData<NodeID> = { id: id, tag: tag };
        this.send({ type: MutationType.CREATE_NODE, ...data });

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
}
