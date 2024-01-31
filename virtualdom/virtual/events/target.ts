import { VirtualEvent, EventCompleteOptions, EventListener, EventOptions, EventType, IEventEngine, IEventTarget } from "./types";

export type EventEngine<NodeID> = IEventEngine<NodeID, EventTarget<NodeID>>;
type ListenerArray    <NodeID>  = [EventListener<NodeID>, EventCompleteOptions][];
type ListenerContainer<NodeID>  = { [key: EventType]: ListenerArray<NodeID> };

export class EventTarget<NodeID> implements IEventTarget<NodeID> {
    readonly engine    : EventEngine<NodeID>;
    private  listeners : ListenerContainer<NodeID>;

    constructor (engine: EventEngine<NodeID>) {
        this.engine = engine;

        this.listeners = {};
    }

    private getListenerArray (type: EventType): ListenerArray<NodeID> {
        let currentArray: ListenerArray<NodeID> | undefined = this.listeners[type];
        if (currentArray !== undefined) return currentArray;

        return this.listeners[type] = [];
    }
    private fillOptions (options: EventOptions | undefined): EventCompleteOptions {
        if (options === undefined)
            return { capture: false, once: false, passive: false, signal: false };
        if (typeof options === "boolean")
            return { capture: options, once: false, passive: false, signal: false };
        
        if (options.capture === undefined) options.capture = false;
        if (options.once    === undefined) options.once    = false;
        if (options.passive === undefined) options.passive = false;
        if (options.signal  === undefined) options.signal  = false;

        return options;
    }

    addEventListener (type: EventType, listener: EventListener<NodeID>, options?: EventOptions): void {
        let listenerArray: ListenerArray<NodeID> = this.getListenerArray(type);

        options = this.fillOptions(options);

        listenerArray.push([ listener, options ]);

        this.engine.subscribe(type, this);
    };
    removeEventListener (type: EventType, listener: EventListener<NodeID>, options?: EventOptions): void {
        let listenerArray: ListenerArray<NodeID> = this.getListenerArray(type);

        options = this.fillOptions(options);

        let index = -1;
        for (let id = 0; id < listenerArray.length; id ++) {
            let localListenerAndOptions: [EventListener<NodeID>, EventCompleteOptions] | undefined = listenerArray[id];
            if (localListenerAndOptions === undefined) continue ;

            let localListener = localListenerAndOptions[0];
            let localOptions  = localListenerAndOptions[1];

            if (listener == localListener
             && options.capture === localOptions.capture
             && options.once    === localOptions.once
             && options.passive === localOptions.passive
             && options.signal  === localOptions.signal) {
                index = id;
                break ;
            }
        }

        if (index === -1) return ;
    
        listenerArray.splice(index, 1);

        if (listenerArray.length === 0)
            this.engine.unsubscribe(type, this);
    };

    private runEvent (event: VirtualEvent<NodeID>, listener: EventListener<NodeID>) {
        if (listener === null) return ;

        if ("handleEvent" in listener)
            listener.handleEvent(event);
        else listener(event);
    }
    dispatchEvent (type: EventType, event: VirtualEvent<NodeID>): void {
        let listenerArray: ListenerArray<NodeID> = this.getListenerArray(type);

        for (let [listener] of listenerArray)
            this.runEvent(event, listener);
    };
}