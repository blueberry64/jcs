import {Component} from "./component";
import {ChunkUtils} from "./chunk";

export type Query = {include :  Uint32Array, exclude : Uint32Array};

export class QueryFactory {
    private component_query_map : Map<Function, Uint32Array> = new Map<Function, Uint32Array>();
    private offset_component_map : Map<number, Function> = new Map<number, Function>();
    private component_size_map : Map<Function, number> = new Map<Function, number>();

    public make_system_query(include : Function[], exclude : Function[]) : Query {
        return { include : this.make_query_array(include), exclude : this.make_query_array(exclude) };
    }

    public get_component_size(component_type : Function) : number {
        return this.component_size_map.get(component_type);
    }

    public make_query_array(query : Function[]) : Uint32Array {
        let bitmask_array = new Uint32Array(1);
        for (const component of query) {
            const bitmask = this.get_component_bitmask(component);
            bitmask_array = QueryFactory.combine_bitmasks(bitmask, bitmask_array, bitmask_array);
        }

        return bitmask_array;
    }

    private get_component_bitmask(component_type : Function) {
        if (this.component_query_map.has(component_type)) {
            return this.component_query_map.get(component_type);
        }

        return this.add_component_bitmask(component_type);
    }

    private add_component_bitmask(component_type : Function) {
        const total_bitshift = this.component_query_map.size;
        const query_index = Math.floor(total_bitshift / 32);
        const bitmask = new Uint32Array(query_index + 1);

        const bitshift = total_bitshift % 32;
        bitmask[query_index] |= 1 << bitshift;

        this.component_query_map.set(component_type, bitmask);
        this.offset_component_map.set(total_bitshift, component_type);

        // @ts-ignore
        const instance = new component_type();
        this.component_size_map.set(component_type, instance.size);

        return bitmask;
    }

    public static combine_bitmasks(a : Uint32Array, b : Uint32Array, output : Uint32Array) : Uint32Array {
        let bigger = a;
        let smaller = b;
        if (b.length > a.length) {
            bigger = b;
            smaller = a;
        }

        let output_bitmask = output;
        if (output_bitmask.length < bigger.length) {
            output_bitmask = new Uint32Array(bigger.length);
            for (let i = 0; i < output.length; i++) {
                output_bitmask[i] |= output[i];
            }
        }

        for (let i = 0; i < bigger.length; i++) {
            output_bitmask[i] |= bigger[i];

            if (i < smaller.length) {
                output_bitmask[i] |= smaller[i];
            }
        }

        return output_bitmask;
    }

    public get_chunk_component_types(chunk_query : Uint32Array) : Function[] {
        let chunk_component_types : Function[] = [];
        for (let chunk_mask_index = 0; chunk_mask_index < chunk_query.length; chunk_mask_index++) {
            const chunk_mask = chunk_query[chunk_mask_index];
            for (let bit_offset = 0; bit_offset < 32; bit_offset++) {
                if (((chunk_mask >> bit_offset) & 1) === 1) {
                    const total_offset = (chunk_mask_index * 32) + bit_offset;
                    chunk_component_types.push(this.offset_component_map.get(total_offset));
                }
            }
        }

        return chunk_component_types;
    }

    public get_chunk_entity_size(chunk_component_types : Function[]) : number {
        let entity_byte_size = 0;
        for (const component_type of chunk_component_types) {
            entity_byte_size += this.component_size_map.get(component_type);
        }

        return entity_byte_size;
    }
}

export class QueryUtils {

    private constructor() {}

    private static check_include(chunk_include : Uint32Array, system_include : Uint32Array) : boolean {
        if (system_include.length > chunk_include.length) {
            return false;
        }

        //sys <= chunk
        for (let i = 0; i < system_include.length; i++) {
            const overlap = system_include[i] & chunk_include[i];
            if (overlap !== system_include[i]) {
                return false;
            }
        }

        return true;
    }

    private static check_exclude(chunk_include : Uint32Array, system_exclude : Uint32Array) : boolean {
        for (let i = 0; i < system_exclude.length; i++) {
            if (i >= chunk_include.length) {
                return false;
            }

            if ((chunk_include[i] & system_exclude[i]) !== 0) {
                return false;
            }
        }

        return true;
    }

    public static Matches(chunk_includes : Uint32Array, system_query : Query) : boolean {
        return QueryUtils.check_exclude(chunk_includes, system_query.exclude) &&
               QueryUtils.check_include(chunk_includes, system_query.include);
    }
}
