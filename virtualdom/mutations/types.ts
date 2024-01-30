
export enum MutationType {
    CREATE_NODE,
    DELETE_NODE,

    APPEND_CHILD,
    REMOVE_CHILD,
    INSERT_BEFORE,
    REPLACE_CHILD,

    SET_PROPERTY
}

export type CreateNodeMutationData  <NodeID> = { id: NodeID, tag: string };
export type DeleteNodeMutationData  <NodeID> = { id: NodeID };
export type AppendChildMutationData <NodeID> = { parent: NodeID, child: NodeID };
export type RemoveChildMutationData <NodeID> = { parent: NodeID, child: NodeID };
export type InsertBeforeMutationData<NodeID> = { parent: NodeID, newNode: NodeID, reference: NodeID };
export type ReplaceChildMutationData<NodeID> = { parent: NodeID, newChild: NodeID, oldChild: NodeID };

export type SetProperty<NodeID> = { id: NodeID, path: string[], value: any };

export type Mutation<NodeID> = {
    type: MutationType,
} & (
    CreateNodeMutationData  <NodeID>
  | DeleteNodeMutationData  <NodeID>
  | AppendChildMutationData <NodeID>
  | RemoveChildMutationData <NodeID>
  | InsertBeforeMutationData<NodeID>
  | ReplaceChildMutationData<NodeID>
  | SetProperty             <NodeID>
);

export interface MutationPatcher<NodeID> {
    createNode   (mutation: CreateNodeMutationData  <NodeID>): void;
    deleteNode   (mutation: DeleteNodeMutationData  <NodeID>): void;
    appendChild  (mutation: AppendChildMutationData <NodeID>): void;
    removeChild  (mutation: RemoveChildMutationData <NodeID>): void;
    insertBefore (mutation: InsertBeforeMutationData<NodeID>): void;
    replaceChild (mutation: ReplaceChildMutationData<NodeID>): void;
    setProperty  (mutation: SetProperty             <NodeID>): void;

    apply (mutation: Mutation<NodeID>): void;
}
