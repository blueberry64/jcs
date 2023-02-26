import {Query, QueryFactory} from "./query";
import {Chunk} from "./chunk";

export abstract class System {

    public abstract get include_for_update() : Function[];
    public abstract get exclude_for_update() : Function[];

    public query : Query;


    public init(in_query : Query) {
        this.query = in_query;
    }

    public abstract update(chunk_data : Chunk);

    protected static read_float(view : DataView, offset : number,) : number {
        return view.getFloat32(offset, true);
    }

    protected static set_float(view : DataView, offset : number, value) {
        return view.setFloat32(offset, value, true);
    }
}