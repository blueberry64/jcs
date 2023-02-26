import { Worker } from 'worker_threads';
import {SystemContainer} from "./system_container";
import {Position} from "../game/movement/components/position";
import {Velocity} from "../game/movement/components/velocity";
import {ChunkUtils} from "./chunk";

const WORKER_FILE_PATH = './build/ecs/system_worker.js';

export class World {
    private system_container = new SystemContainer();

    public update() {
        // const floats = new Float32Array([1.5, 2.5, 3.5, 4.5]);
        const worker = new Worker(WORKER_FILE_PATH);
        //
        // const ints = new Int32Array([1, 2, 3, 4]);
        const worker2 = new Worker(WORKER_FILE_PATH);

        worker.on('message', (result) => {
            print_stuff("1", result[1])
        });

        worker2.on('message', (result) => {
            print_stuff("2", result[1])
        });


        let positions : Position[] = [];
        let velocities : Velocity[] = [];

        for (let i = 0; i < 256; i++) {
            positions.push(new Position(i, 2*i, 3*i));
            velocities.push(new Velocity(1, -1, i));
        }

        const chunk1 = this.system_container.make_chunk([positions, velocities], Position, Velocity);
        // console.log(chunk1.chunk);
        const chunk2 = this.system_container.make_chunk([positions, velocities], Velocity, Position);
        // console.log((chunk2.chunk));

        worker.postMessage([chunk1.archetype, chunk1.buffer]);
        worker2.postMessage([chunk2.archetype, chunk2.buffer]);

        worker.postMessage([chunk1.archetype, chunk1.buffer]);
        worker2.postMessage([chunk2.archetype, chunk2.buffer]);
    }
}

function print_stuff(label : string, chunk_data : ArrayBuffer) {
    console.log(label);

    const positions = new Float32Array(chunk_data, 0, 256);
    console.log(positions[0], positions[1], positions[2]);

    const velocities = new Float32Array(chunk_data, 1024, 256);
    console.log(velocities[0], velocities[1], velocities[2]);
}
