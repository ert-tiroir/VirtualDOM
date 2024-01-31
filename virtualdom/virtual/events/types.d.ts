
/* EVENT INTERFACES */

export type VirtualCompositionEvent   = {
    data: string
};
export type VirtualFocusEvent<NodeID> = {
    relatedTarget: NodeID | IEventTarget<NodeID> | null
};
export type VirtualInputEvent = {
    data: string | null,
    inputType: string
}
export type VirtualKeyboardEvent = {
    altKey: boolean,
    code: string,
    ctrlKey: boolean,
    isComposing: boolean,
    key: string,
    location: number,
    metaKey: boolean,
    repeat: boolean,
    shiftKey: boolean,
    keyCode: number,
    charCode: number
};
export type VirtualMouseEvent<NodeID> = {
    altKey: boolean,
    button: number,
    buttons: number,
    clientX: number,
    clientY: number,
    ctrlKey: boolean,
    layerX: number,
    layerY: number,
    metaKey: boolean,
    movementX: number,
    movementY: number,
    offsetX: number,
    offsetY: number,
    pageX: number,
    pageY: number,
    relatedTarget: NodeID | null | IEventTarget<NodeID>,
    screenX: number,
    screenY: number,
    shiftKey: boolean,
    x: number,
    y: number
};

export type VirtualEvent<NodeID> = ({
    bubbles: boolean,
    cancelable: boolean,
    composed: boolean,
    currentTarget: NodeID | IEventTarget<NodeID> | null,
    eventPhase: number,
    isTrusted: boolean,
    target: NodeID | IEventTarget<NodeID> | null,
    type: string
} & (
    {}
  | VirtualCompositionEvent
  | VirtualFocusEvent<NodeID>
  | VirtualInputEvent
  | VirtualKeyboardEvent
  | VirtualMouseEvent<NodeID>
)) | Event;

/* EVENT PROPERTIES */

export type EventType            = string;
export type EventCompleteOptions = {
    capture ?: boolean,
    once    ?: boolean,
    passive ?: boolean,
    signal  ?: boolean
}
export type EventOptions = EventCompleteOptions | boolean;

/* EVENT HANDLER */

export type EventHandler<NodeID>       = (event: VirtualEvent<NodeID>) => void;
export type EventHandlerObject<NodeID> = { handleEvent: EventHandler<NodeID> };

export type EventListener<NodeID> = EventHandler<NodeID> | EventHandlerObject<NodeID> | null;

/* BASE OBJECTS */

export interface IEventTarget<NodeID> {
    addEventListener    (type: EventType, listener: EventListener<NodeID>, options?: EventOptions): void;
    removeEventListener (type: EventType, listener: EventListener<NodeID>, options?: EventOptions): void;
    dispatchEvent       (type: EventType, event: VirtualEvent<NodeID>): void;
}

export interface IEventEngine<NodeID, EventTarget extends IEventTarget<NodeID>> {
    subscribe   (type: EventType, target: EventTarget): void;
    unsubscribe (type: EventType, target: EventTarget): void;

    dispatchEvent (type: EventType, id: NodeID, event: VirtualEvent<NodeID>): void;
}
