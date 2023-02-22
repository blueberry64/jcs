import {System} from "./system";
import {QueryFactory, QueryUtils} from "./systemQuery";
import {MoveSystem} from "../game/movement/systems/move_system";

//Guarantee systems and queries created in same order across different workers
export class SystemContainer {
    private query_factory = new QueryFactory();
    private systems : System[] = [];

    public constructor() {
        this.systems.push(new MoveSystem());

        for (const system of this.systems) {
            system.init(this.query_factory.make_system_query(system.include_for_update, system.exclude_for_update));
        }
    }

    //workers to update chunks
    public update(chunk_includes, chunk) {
        for (const system of this.systems) {
            if (QueryUtils.Matches(chunk_includes, system.query)) {
                system.update(chunk);
            }
        }
    }

    public get_chunk_query(...chunk_query : Function[]) : Uint32Array{
        return this.query_factory.make_query_array(chunk_query);
    }
}