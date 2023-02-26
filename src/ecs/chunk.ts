import {Component} from "./component";
import {Query, QueryFactory} from "./query";


export class ChunkUtils {
    public static readonly CHUNK_BYTE_SIZE = 2048;  //guess at 0.5 * 4kb(?) page size todo investigate

    private constructor() {}

    public static make_chunk_buffer() {
        return new ArrayBuffer(ChunkUtils.CHUNK_BYTE_SIZE);
    }

    public static make_empty() {
        return new ArrayBuffer(ChunkUtils.CHUNK_BYTE_SIZE);
    }

    public static get_max_entities_in_chunk(entity_size : number) {
        return Math.floor(ChunkUtils.CHUNK_BYTE_SIZE / entity_size);
    }
}

export class Chunk {
    private num_entities_per_chunk : number = 0;
    private entity_byte_size : number = 0;
    private data_views : Map<Function, DataView> = new Map<Function, DataView>();

    public init(chunk_query : Uint32Array, chunk : ArrayBuffer, query_factory : QueryFactory) {
        const chunk_query_types = query_factory.get_chunk_component_types(chunk_query);

        this.data_views.clear();
        this.entity_byte_size = query_factory.get_chunk_entity_size(chunk_query_types);
        this.num_entities_per_chunk = ChunkUtils.CHUNK_BYTE_SIZE / this.entity_byte_size;

        let offset = 0;
        for (const component_type of chunk_query_types) {
            const component_size = query_factory.get_component_size(component_type);
            const view_bytes = component_size * this.num_entities_per_chunk;
            const component_data_view = new DataView(chunk, offset, view_bytes);
            offset += view_bytes;
            this.data_views.set(component_type, component_data_view);
        }
    }

    public get(component_type : Function) : DataView {
        return this.data_views.get(component_type);
    }

    public set(index : number, component : Component) {
        component.set_values_in(index * component.size, this.data_views.get(component.constructor));
    }
}