
import { createClassicalBridge } from '../../lib/bridge/classical.js';
import { DocumentType } from '../../lib/virtual/document.js';
import { TestingEventEngine } from '../../lib/testing/utils/virtual/events/engine.js';
import { DOMMutationPatcher } from '../../lib/mutations/patch/dom.js';
import { IntegralMutationEngine } from '../../lib/virtual/mutations/integer.js';

import { DOMSubscribable } from '../../lib/events/dom.js';

import { BridgeEngine } from '../../lib/virtual/events/bridge.js';

let patcher = new DOMMutationPatcher(document.body);
let te      = new BridgeEngine();
let [ vbridge, dbridge ] = createClassicalBridge(te, patcher, new DOMSubscribable());
te.useBridge(vbridge);

let en   = new IntegralMutationEngine(vbridge);
let docu = new DocumentType(en, te, "localhost:5500");

let el = docu.createElement("h1")
docu.appendChild(el);

let tx = docu.createTextElement("Hello, World !");
el.appendChild(tx);

let callback = (event) => { console.log("received event", event); el.removeEventListener("click", callback) }

el.addEventListener("click", callback)

el.className = "w-full h-full bg-red-300"
el.classList.add("text-blue-400")
el.classList.remove(el.classList[1])
