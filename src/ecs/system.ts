import {SystemQuery, QueryFactory} from "./systemQuery";

export abstract class System {

    public abstract get include_for_update() : Function[];
    public abstract get exclude_for_update() : Function[];

    public query : SystemQuery;


    public init(in_query : SystemQuery) {
        this.query = in_query;
    }

    public abstract update(chunk : ArrayBuffer);
}