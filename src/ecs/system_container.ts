import {System} from "./system";
import {QueryFactory, QueryUtils} from "./query";
import {MoveSystem} from "../game/movement/systems/move_system";
import {ChunkUtils} from "./chunk";
import {Component} from "./component";

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

    public update(chunk_includes : Uint32Array, chunk : ArrayBuffer) {
        const component_types = this.query_factory.get_chunk_component_types(chunk_includes);
        const entity_size = this.query_factory.get_chunk_entity_size(component_types);

        const num_entities = ChunkUtils.CHUNK_BYTE_SIZE / entity_size; //todo not full chunks all the time.
        const chunk_data = ChunkUtils.get_chunk_data_views(entity_size,
                                                           component_types,
                                                           this.query_factory.component_size_map,
                                                           chunk);

        for (const system of this.systems) {
            if (QueryUtils.Matches(chunk_includes, system.query)) {
                system.update(num_entities, chunk_data);
            }
        }
    }

    public get_chunk_query(...chunk_query : Function[]) : Uint32Array{
        return this.query_factory.make_query_array(chunk_query);
    }

    public make_chunk(data : Component[][], ...chunk_query : Function[]) : {archetype : Uint32Array, chunk : ArrayBuffer} {
        const component_size_map = this.query_factory.component_size_map;
        const entity_size = this.query_factory.get_chunk_entity_size(chunk_query);

        const chunk = ChunkUtils.make_empty();
        const chunk_data = ChunkUtils.get_chunk_data_views(entity_size, chunk_query, component_size_map, chunk);

        for (const component_array of data) {
            //ass-umption: each component array is nonempty and same type. todo fix - generic type or something.
            const first = component_array[0];
            const component_type = first.constructor;
            const size = component_size_map.get(component_type);
            const component_data = chunk_data.get(component_type);

            let offset = 0;
            const last_offset = component_data.byteLength - size;
            for (const instance of component_array) {
                if (offset >= last_offset) {
                    break; //todo multiple chunks
                }

                instance.set_values_in(offset, component_data);
                offset += size;
            }
        }

        return { archetype: this.query_factory.make_query_array(chunk_query), chunk : chunk};
    }
}