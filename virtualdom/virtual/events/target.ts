import { Event, EventCompleteOptions, EventListener, EventOptions, EventType, IEventEngine, IEventTarget } from "./types";

export type EventEngine = IEventEngine<EventTarget>;
type ListenerArray      = [EventListener, EventCompleteOptions][];
type ListenerContainer  = { [key: EventType]: ListenerArray };

export class EventTarget implements IEventTarget {
    readonly engine    : EventEngine;
    private  listeners : ListenerContainer;

    constructor (engine: EventEngine) {
        this.engine = engine;

        this.listeners = {};
    }

    private getListenerArray (type: EventType): ListenerArray {
        let currentArray: ListenerArray | undefined = this.listeners[type];
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

    addEventListener (type: EventType, listener: EventListener, options?: EventOptions): void {
        let listenerArray: ListenerArray = this.getListenerArray(type);

        options = this.fillOptions(options);

        listenerArray.push([ listener, options ]);

        this.engine.subscribe(type, this);
    };
    removeEventListener (type: EventType, listener: EventListener, options?: EventOptions): void {
        let listenerArray: ListenerArray = this.getListenerArray(type);

        options = this.fillOptions(options);

        let index = -1;
        for (let id = 0; id < listenerArray.length; id ++) {
            let localListenerAndOptions: [EventListener, EventCompleteOptions] | undefined = listenerArray[id];
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

    private runEvent (event: Event, listener: EventListener) {
        if (listener === null) return ;

        if ("handleEvent" in listener)
            listener.handleEvent(event);
        else listener(event);
    }
    dispatchEvent (type: EventType, event: Event): void {
        let listenerArray: ListenerArray = this.getListenerArray(type);

        for (let [listener] of listenerArray)
            this.runEvent(event, listener);
    };
}