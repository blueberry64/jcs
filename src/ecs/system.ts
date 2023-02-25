import {Query, QueryFactory} from "./query";

export abstract class System {

    public abstract get include_for_update() : Function[];
    public abstract get exclude_for_update() : Function[];

    public query : Query;


    public init(in_query : Query) {
        this.query = in_query;
    }

    public abstract update(num_entities : number, chunk_data : Map<Function, DataView>);
}