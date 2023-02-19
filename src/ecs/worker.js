const { parentPort, workerData } = require('worker_threads');

const myTypedArray = new Uint8Array(workerData.typedArray);
const func = workerData.func;
func(myTypedArray);
parentPort.postMessage(myTypedArray.buffer, [myTypedArray.buffer]);