import {Component} from "./component";


export class ChunkUtils {
    public static readonly CHUNK_BYTE_SIZE = 2048;  //guess at 0.5 * 4kb(?) page size todo investigate

    private constructor() {}

    public static make_chunk(num_entities : number, entity_size : number, ) {
        return new ArrayBuffer(ChunkUtils.CHUNK_BYTE_SIZE);
    }

    public static make_empty() {
        return new ArrayBuffer(ChunkUtils.CHUNK_BYTE_SIZE);
    }

    public static get_chunk_data_views(entity_byte_size : number,
                                       chunk_component_types : Function[],
                                       component_size_map : Map<Function, number>,
                                       chunk : ArrayBuffer)
                                        : Map<Function, DataView>
    {
        const output = new Map<Function, DataView>();
        const max_entities_in_chunk = ChunkUtils.CHUNK_BYTE_SIZE / entity_byte_size;

        let offset = 0;
        for (const component_type of chunk_component_types) {
            const component_size = component_size_map.get(component_type);
            const view_bytes = component_size * max_entities_in_chunk;
            const component_data_view = new DataView(chunk, offset, view_bytes);
            offset += view_bytes;
            output.set(component_type, component_data_view);
        }

        return output;
    }

    public static get_max_entities_in_chunk(entity_size : number) {
        return Math.round(ChunkUtils.CHUNK_BYTE_SIZE / entity_size);
    }
}