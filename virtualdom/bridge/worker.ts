import { EventSubscribable } from "virtualdom/events/subscribable.js";
import { Mutation, MutationPatcher } from "../mutations/types.js";
import { EventEngine } from "../virtual/events/target.js";
import { DOMBridge, VirtualBridge } from "./abstract.js";
import { Channel } from "./channels/channel.js";
import { Transceiver } from "./channels/transceiver.js";
import { VirtualEvent } from "virtualdom/virtual/events/types.js";
import { MutationEngine } from "virtualdom/virtual/mutations/engine.js";

enum MessageType {
    PATCH, SUBSCRIBE, UNSUBSCRIBE, DISPATCH
};

type Message<NodeID> = { message: MessageType.PATCH, mutation: Mutation<NodeID> }
                     | { message: MessageType.SUBSCRIBE, target: NodeID, event: string }
                     | { message: MessageType.UNSUBSCRIBE, target: NodeID, event: string }
                     | { message: MessageType.DISPATCH, target: NodeID, type: string, event: VirtualEvent<NodeID> };

export class WorkerVirtualBridge<NodeID extends "number" | "string" | "symbol"> implements VirtualBridge<NodeID> {
    eventEngine: EventEngine<NodeID>;
    mutationEngine: MutationEngine<NodeID>;
    channel: Channel;
    messages:   Message<NodeID>[];

    useMutationEngine (mutationEngine: MutationEngine<NodeID>) {
        this.mutationEngine = mutationEngine;
    }
    constructor (transceiver: Transceiver, channelName: string, eventEngine: EventEngine<NodeID>) {
        this.eventEngine = eventEngine;

        this.channel = new Channel(channelName, (data: string) => this.onmessage(data));
        transceiver.registerChannel(this.channel);
        this.messages = [];
    }

    postMessage (data: Message<NodeID>) {
        this.messages.push(data);

        if (this.messages.length != 1) return ;

        setTimeout(() => {
            this.channel.postMessage(this.messages);

            this.messages = [];
        }, 0);
    }

    subscribe(event: string, target: NodeID): void {
        this.postMessage({ message: MessageType.SUBSCRIBE, target: target, event: event });
    }
    unsubscribe(event: string, target: NodeID): void {
        this.postMessage({ message: MessageType.UNSUBSCRIBE, target: target, event: event });
    }
    
    sendPatch(patch: Mutation<NodeID>): void {
        this.postMessage({ message: MessageType.PATCH, mutation: patch });
    }
    solveEvent (event: any, key: string) {
        let data: NodeID | null | undefined = event[key];
        if (data === null || data === undefined) return ;

        event[key] = this.mutationEngine.getNode(data);
        if (event[key] === undefined) event[key] = null;
    }
    dispatchEvent (id: NodeID, target: string, event: VirtualEvent<NodeID>) {
        for (let key of [ "target", "currentTarget", "relatedTarget" ])
            this.solveEvent(event, key);

        this.eventEngine.dispatchEvent(target, id, event);
    }

    onmessage (data: string) {
        let message = JSON.parse(data) as Message<NodeID>;

        if (message.message === MessageType.DISPATCH)
            this.dispatchEvent(message.target, message.type, message.event);
    }
}

export class WorkerDOMBridge<NodeID> implements DOMBridge<NodeID> {
    patcher:    MutationPatcher<NodeID>;
    subscriber: EventSubscribable<NodeID, Node>;
    channel:    Channel;

    constructor (transceiver: Transceiver, channelName: string, patcher: MutationPatcher<NodeID>, subscriber: EventSubscribable<NodeID, Node>) {
        this.patcher = patcher;
        this.channel = new Channel(channelName, (data: string) => this.onmessage(data));

        this.subscriber = subscriber;
        subscriber.setCallback((id: NodeID, target: string, event: Event) => this.onevent(id, target, event))
    
        transceiver.registerChannel(this.channel);
    }

    onmessage (data: string) {
        let messages = JSON.parse(data) as Message<NodeID>[];
        
        for (let message of messages) {
            if (message.message === MessageType.PATCH) this.sendPatch(message.mutation);
        
            if (message.message === MessageType.SUBSCRIBE)   this.subscribe(message.event, message.target);
            if (message.message === MessageType.UNSUBSCRIBE) this.unsubscribe(message.event, message.target);
        }
    }

    postMessage (data: Message<NodeID>) {
        this.channel.postMessage(data);
    }
    asNodeID (target: any): NodeID | null {
        if (target === null || target === undefined) return null;
        if ("nodeID" in target)
            return target.nodeID;
        return null;
    }
    onevent (id: NodeID, target: string, event: Event) {
        let forwardedEvent: VirtualEvent<NodeID> = {
            bubbles: event.bubbles,
            cancelable: false,
            composed: event.composed,
            currentTarget: this.asNodeID(event.currentTarget),
            eventPhase: event.eventPhase,
            isTrusted: event.isTrusted,
            target: this.asNodeID(event.target),
            type: event.type
        };

        if (event instanceof CompositionEvent)
            forwardedEvent = { ...forwardedEvent, data: event.data }
        else if (event instanceof FocusEvent) {
            forwardedEvent = { ...forwardedEvent, relatedTarget: this.asNodeID(event.relatedTarget) };
        } else if (event instanceof InputEvent) {
            forwardedEvent = { ...forwardedEvent, data: event.data, inputType: event.inputType };
        } else if (event instanceof KeyboardEvent) {
            forwardedEvent = {
                ...forwardedEvent,
                altKey:      event.altKey,
                code:        event.code,
                ctrlKey:     event.ctrlKey,
                isComposing: event.isComposing,
                key:         event.key,
                location:    event.location,
                metaKey:     event.metaKey,
                repeat:      event.repeat,
                shiftKey:    event.shiftKey,
                keyCode:     event.keyCode,
                charCode:    event.charCode
            };
        } else if (event instanceof MouseEvent) {
            forwardedEvent = {
                ...forwardedEvent,
                altKey: event.altKey,
                button: event.button,
                buttons: event.buttons,
                clientX: event.clientX,
                clientY: event.clientY,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                movementX: event.movementX,
                movementY: event.movementY,
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                pageX: event.pageX,
                pageY: event.pageY,
                relatedTarget: this.asNodeID( event.relatedTarget ),
                screenX: event.screenX,
                screenY: event.screenY,
                shiftKey: event.shiftKey,
                x: event.x,
                y: event.y
            }
        } else if (event instanceof WheelEvent) {
            forwardedEvent = {
                ...forwardedEvent,
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaZ: event.deltaZ,
                deltaMode: event.deltaMode
            }
        }

        this.postMessage({ message: MessageType.DISPATCH, type: target, target: id, event: forwardedEvent })
    }
    subscribe (event: string, target: NodeID): void {
        let element = this.patcher.getElement(target);
        if (element === undefined) return ;

        this.subscriber.subscribe(target, element, event);
    }
    unsubscribe (event: string, target: NodeID): void {
        let element = this.patcher.getElement(target);
        if (element === undefined) return ;

        this.subscriber.unsubscribe(target, element, event);
    }

    sendPatch (patch: Mutation<NodeID>) {
        this.patcher.apply(patch);
    }
}
