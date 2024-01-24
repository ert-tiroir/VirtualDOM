
/* EVENT INTERFACES */

export type Event = {}

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

export type EventHandler       = (event: Event) => void;
export type EventHandlerObject = { handleEvent: EventHandler };

export type EventListener = EventHandler | EventHandlerObject | null;

/* BASE OBJECTS */

export interface IEventTarget {
    addEventListener    (type: EventType, listener: EventListener, options?: EventOptions): void;
    removeEventListener (type: EventType, listener: EventListener, options?: EventOptions): void;
    dispatchEvent       (type: EventType, event: Event): void;
}

export interface IEventEngine<EventTarget extends IEventTarget> {
    subscribe   (type: EventType, target: EventTarget): void;
    unsubscribe (type: EventType, target: EventTarget): void;

    dispatchEvent (type: EventType, event: Event): void;
}
