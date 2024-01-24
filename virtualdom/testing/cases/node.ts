import { DocumentType } from "../../virtual/document.js";
import { TestingEventEngine } from "../utils/virtual/events/engine.js";

export function testCreateVirtualNode () {
    let engine = new TestingEventEngine();
    let docu   = new DocumentType(engine, "localhost:5500");
    let node   = docu.createElement();
    
    return !node.hasChildNodes()
        && node.getRootNode() === node
        && node.childsNodes.length == 0
        && node.baseURI === "localhost:5500"
        && node.engine === engine
        && !node.isConnected
        && node.previousSibling === null
        && node.nextSibling     === null
        && node.parentElement   === null
        && node.firstChild      === null
        && node.lastChild       === null
        && node.ownerDocument   === docu;
}

export function testAppendChild () {
    let engine = new TestingEventEngine();
    let docu   = new DocumentType(engine, "localhost:5500");
    let node   = docu.createElement();

    docu.appendChild(node);

    return docu.childsNodes.length === 1
        && docu.firstChild === node
        && docu.lastChild  === node
        && docu.childsNodes[0] === node
        && node.isConnected
        && node.parentElement === docu
        && docu.contains(node);
}

export function testCircularAppend () {
    try {
        let engine = new TestingEventEngine();
        let docu   = new DocumentType(engine, "localhost:5500");
        let node   = docu.createElement();
    
        docu.appendChild(node);
        node.appendChild(docu);
    } catch (e) {
        return e instanceof DOMException
            && e.name    === "HierarchyRequestError"
            && e.message === "Node.appendChild: The new child is an ancestor of the parent";
    }

    return false;
}
