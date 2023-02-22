import {Component} from "./component";

export type SystemQuery = {include :  Uint32Array, exclude : Uint32Array};

export class QueryFactory {
    public components : Map<Function, Uint32Array> = new Map<Function, Uint32Array>();

    public
    public constructor() {
        //This don't work, despite what chatgpt has to say
        // let component_classes = Reflect.ownKeys(global).filter(key => {
        //     const target = global[key];
        //     return (typeof target === "function") && (target.prototype instanceof Component);
        // });
        //
        // console.log(component_classes);
    }

    public make_system_query(include : Function[], exclude : Function[]) : SystemQuery {
        return { include : this.make_query_array(include), exclude : this.make_query_array(exclude) };
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
        if (this.components.has(component_type)) {
            return this.components.get(component_type);
        }
        else {
            let bitshift = this.components.size;
            let query_index = Math.floor(bitshift / 32);
            let bitmask = new Uint32Array(query_index + 1);

            bitshift %= 32;
            bitmask[query_index] |= 1 << bitshift;

            this.components.set(component_type, bitmask);
            return bitmask;
        }
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

    public static Matches(chunk_includes : Uint32Array, system_query : SystemQuery) : boolean {
        return QueryUtils.check_exclude(chunk_includes, system_query.exclude) &&
               QueryUtils.check_include(chunk_includes, system_query.include);
    }
}
