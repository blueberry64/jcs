import { Worker } from 'worker_threads';
import {QueryFactory} from "./systemQuery";
import {SystemContainer} from "./system_container";
import {Position} from "../game/movement/components/position";
import {Velocity} from "../game/movement/components/velocity";

const WORKER_FILE_PATH = './build/ecs/system_worker.js';

export class World {

    private system_container = new SystemContainer();

    public update() {
        const floats = new Float32Array([1.5, 2.5, 3.5, 4.5]);
        const worker = new Worker(WORKER_FILE_PATH);

        const ints = new Int32Array([1, 2, 3, 4]);
        const worker2 = new Worker(WORKER_FILE_PATH);

        worker.on('message', (result) => {
            console.log(`result 1: ${result[1]}`);
        });

        worker2.on('message', (result) => {
            console.log(`result 2: ${result[1]}`);
        })

        const query = this.system_container.get_chunk_query(Position, Velocity);
        worker.postMessage([query, floats]);

        const query2 = this.system_container.get_chunk_query(Position, Velocity);
        worker2.postMessage([query2, ints]);

    }
}
