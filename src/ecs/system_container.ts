import {System} from "./system";
import {QueryFactory, QueryUtils} from "./query";
import {MoveSystem} from "../game/movement/systems/move_system";
import {ChunkUtils, Chunk} from "./chunk";
import {Component} from "./component";

//Guarantee systems and queries created in same order across different workers
export class SystemContainer {
    private query_factory = new QueryFactory();
    private systems : System[] = [];

    private chunk : Chunk = new Chunk();

    public constructor() {
        this.systems.push(new MoveSystem());

        for (const system of this.systems) {
            system.init(this.query_factory.make_system_query(system.include_for_update, system.exclude_for_update));
        }
    }

    public update(chunk_includes : Uint32Array, chunk_data : ArrayBuffer) {
        this.chunk.init(chunk_includes, chunk_data, this.query_factory);

        for (const system of this.systems) {
            if (QueryUtils.Matches(chunk_includes, system.query)) {
                system.update(this.chunk);
            }
        }
    }

    public get_chunk_query(...chunk_query : Function[]) : Uint32Array{
        return this.query_factory.make_query_array(chunk_query);
    }

    public make_chunk(data : Component[][], ...chunk_query : Function[]) : { archetype : Uint32Array, buffer : ArrayBuffer} {
        const entity_size = this.query_factory.get_chunk_entity_size(chunk_query);
        const num_entities = ChunkUtils.get_max_entities_in_chunk(entity_size);
        const archetype = this.query_factory.make_query_array(chunk_query);

        let chunk_buffer = ChunkUtils.make_chunk_buffer();
        this.chunk.init(archetype, chunk_buffer, this.query_factory);
        for (const components of data) {
            for (let i = 0; (i < components.length) && (i < num_entities); i++) {
                this.chunk.set(i, components[i]);
            }
        }

        return { archetype: archetype, buffer:chunk_buffer }
    }
}