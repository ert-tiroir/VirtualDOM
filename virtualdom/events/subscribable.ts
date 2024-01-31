
export interface EventSubscribable<NodeID, Node> {
    setCallback (callback: any): void;

    subscribe (id: NodeID, node: Node, target: string): void;
    unsubscribe (id: NodeID, node: Node, target: string): void;
}
