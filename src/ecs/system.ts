import {Query} from "./query";
import {Entity} from "./entity";
import {Chunk, ComponentData} from "./chunk";

export abstract class System{ //todo generic-ify? https://github.com/Microsoft/TypeScript/pull/26063b
    public abstract get query(): Query;

    public init(){}

    public abstract update(entities : Array<Entity>, chunk : Chunk);

    public get requiresForUpdate() {
        return this.query;
    }
}