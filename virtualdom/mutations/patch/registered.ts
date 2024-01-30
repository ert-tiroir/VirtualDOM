import { AppendChildMutationData, CreateNodeMutationData, DeleteNodeMutationData, InsertBeforeMutationData, Mutation, MutationPatcher, MutationType, RemoveChildMutationData, ReplaceChildMutationData, SetProperty } from "../types.js";

export abstract class RegisteredMutationPatcher<NodeID> implements MutationPatcher<NodeID> {
    abstract createElement (id: NodeID, tag: string): void;
    abstract deleteElement (id: NodeID): void;
    abstract getElement    (id: NodeID): Node | undefined;

    createNode(mutation: CreateNodeMutationData<NodeID>): void {
        this.createElement(mutation.id, mutation.tag);   
    }
    deleteNode(mutation: DeleteNodeMutationData<NodeID>): void {
        this.deleteElement(mutation.id);
    }
    appendChild(mutation: AppendChildMutationData<NodeID>): void {
        let parent = this.getElement(mutation.parent);
        let child  = this.getElement(mutation.child);
        if (parent === undefined || child === undefined) return ;

        parent.appendChild(child);
    }
    removeChild(mutation: RemoveChildMutationData<NodeID>): void {
        let parent = this.getElement(mutation.parent);
        let child  = this.getElement(mutation.child);
        if (parent === undefined || child === undefined) return ;

        parent.removeChild(child);
    }
    insertBefore(mutation: InsertBeforeMutationData<NodeID>): void {
        let parent    = this.getElement(mutation.parent);
        let newNode   = this.getElement(mutation.newNode);
        let reference = this.getElement(mutation.reference);
        if (parent === undefined || newNode === undefined || reference === undefined) return ;

        parent.insertBefore(newNode, reference);
    }
    replaceChild(mutation: ReplaceChildMutationData<NodeID>): void {
        let parent   = this.getElement(mutation.parent);
        let newChild = this.getElement(mutation.newChild);
        let oldChild = this.getElement(mutation.oldChild);
        if (parent === undefined || newChild === undefined || oldChild === undefined) return ;

        parent.replaceChild(newChild, oldChild);
    }
    setProperty(mutation: SetProperty<NodeID>): void {
        if (mutation.path.length === 0) return ;

        let object: any | undefined = this.getElement(mutation.id);
        if (object === undefined) return ;

        for (let i = 0; i + 1 < mutation.path.length; i ++) {
            let name: string | undefined = mutation.path[i];
            if (name === undefined) return ;

            object = object[name];
            if (object === undefined) return ;
        }

        let name: string | undefined = mutation.path[mutation.path.length - 1];
        if (name === undefined) return ;

        object[name] = mutation.value;
    }

    apply(mutation: Mutation<NodeID>): void {
        if (mutation.type === MutationType.CREATE_NODE) {
            if (!("id"  in mutation)) return ;
            if (!("tag" in mutation)) return ;
        
            this.createNode(mutation);
            return ;
        }
        if (mutation.type === MutationType.DELETE_NODE) {
            if (!("id" in mutation)) return ;
        
            this.deleteNode(mutation);
            return ;
        }
        if (mutation.type === MutationType.APPEND_CHILD) {
            if (!("parent" in mutation)) return ;
            if (!("child"  in mutation)) return ;
        
            this.appendChild(mutation);
            return ;
        }
        if (mutation.type === MutationType.REMOVE_CHILD) {
            if (!("parent" in mutation)) return ;
            if (!("child"  in mutation)) return ;
        
            this.removeChild(mutation);
            return ;
        }
        if (mutation.type === MutationType.INSERT_BEFORE) {
            if (!("parent"    in mutation)) return ;
            if (!("newNode"   in mutation)) return ;
            if (!("reference" in mutation)) return ;
        
            this.insertBefore(mutation);
            return ;
        }
        if (mutation.type === MutationType.REPLACE_CHILD) {
            if (!("parent"   in mutation)) return ;
            if (!("newChild" in mutation)) return ;
            if (!("oldChild" in mutation)) return ;
        
            this.replaceChild(mutation);
            return ;
        }
        if (mutation.type === MutationType.SET_PROPERTY) {
            if (!("id"    in mutation)) return ;
            if (!("path"  in mutation)) return ;
            if (!("value" in mutation)) return ;

            this.setProperty(mutation);
        }
    }
}
