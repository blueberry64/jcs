import { parentPort, workerData } from 'worker_threads';
import {SystemContainer} from "./system_container";


var system_container = new SystemContainer();

parentPort.on('message', (message) => {
    const query = message[0];
    const chunk = message[1];
    system_container.update(query, chunk);
    parentPort.postMessage(message);
});