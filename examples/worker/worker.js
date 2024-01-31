
import { WorkerTransceiver } from '../../lib/bridge/channels/transceiver.js';
import { WorkerVirtualBridge } from '../../lib/bridge/worker.js';
import { BridgeEngine } from '../../lib/virtual/events/bridge.js';
import { DocumentType } from '../../lib/virtual/document.js';
import { IntegralMutationEngine } from '../../lib/virtual/mutations/integer.js';

let transc = new WorkerTransceiver();
let engine = new BridgeEngine();
let bridge = new WorkerVirtualBridge(transc, "worker", engine);
engine.useBridge(bridge);

let mutationEngine = new IntegralMutationEngine(bridge);
bridge.useMutationEngine(mutationEngine);
let document = new DocumentType(mutationEngine, engine, "localhost:5500")
let el = document.createElement("h1");
let tx = document.createTextElement("Hello, Worker !")
el.appendChild(tx);
document.appendChild(el);

el.addEventListener("click", (event) => {
    el.className = "w-full h-full bg-red-300"
    el.classList.add("text-blue-400")
    el.classList.remove(el.classList[1])
})
