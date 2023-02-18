import {Query} from "./query";
import {Chunk} from "./chunk";

export abstract class System{ //todo generic-ify? https://github.com/Microsoft/TypeScript/pull/26063b
    public abstract get query(): Query;

    public init(){}

    public abstract update(entities : Int32Array, chunk : Chunk);

    public get requiresForUpdate() {
        return this.query;
    }
}