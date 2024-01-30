
import { createClassicalBridge } from '../../lib/bridge/classical.js';
import { DocumentType } from '../../lib/virtual/document.js';
import { TestingEventEngine } from '../../lib/testing/utils/virtual/events/engine.js';
import { DOMMutationPatcher } from '../../lib/mutations/patch/dom.js';
import { IntegralMutationEngine } from '../../lib/virtual/mutations/integer.js';

let patcher = new DOMMutationPatcher(document.body);
let [ vbridge, dbridge ] = createClassicalBridge(patcher);

let te   = new TestingEventEngine();
let en   = new IntegralMutationEngine(vbridge);
let docu = new DocumentType(en, te, "localhost:5500");

let el = docu.createElement("h1")
docu.appendChild(el);

let tx = docu.createTextElement("Hello, World !");
el.appendChild(tx);
