const { Worker, isMainThread, parentPort } = require('worker_threads');
import { System } from "./system";
import {Chunk} from "./chunk";

export class World {
    private workers : Worker[];
    private systems : System[];

    constructor(num_workers : number = 128) {
        for (let i = 0; i < num_workers; i++){
            const worker = new Worker("./worker.js");
            worker.on("postupdate", (data) => {
                console.log("worker finished");
                this.workers.push(worker);
            });
            this.workers.push(worker);
        }
    }

    private add_system(system : System) {
        this.systems.push(system);
    }

    public update() {
        for (const system of this.systems) {
            const chunks = this.find_matching_chunks(system);
            for (const chunk of chunks) {
                const worker = this.workers.pop();
                worker.postMessage({ typedArray: chunk.data, func: system.update }, [chunk.data])
            }
        }
    }

    private find_matching_chunks(system : System) : Chunk[] {
        return [];
    }
}
