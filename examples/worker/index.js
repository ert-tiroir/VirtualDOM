
import { WorkerDOMBridge } from '../../lib/bridge/worker.js';
import { DocumentType } from '../../lib/virtual/document.js';
import { TestingEventEngine } from '../../lib/testing/utils/virtual/events/engine.js';
import { DOMMutationPatcher } from '../../lib/mutations/patch/dom.js';
import { IntegralMutationEngine } from '../../lib/virtual/mutations/integer.js';

import { DOMSubscribable } from '../../lib/events/dom.js';

import { BridgeEngine } from '../../lib/virtual/events/bridge.js';

import { WindowTransceiver } from '../../lib/bridge/channels/transceiver.js';
import { Channel } from '../../lib/bridge/channels/channel.js';

let worker = new Worker("./worker.js", { type: "module" });
let transc = new WindowTransceiver(worker);

let patcher = new DOMMutationPatcher(document.body);
let bridge  = new WorkerDOMBridge(transc, "worker", patcher, new DOMSubscribable());
