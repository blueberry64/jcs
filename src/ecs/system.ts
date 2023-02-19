import {Query} from "./query";
import {Chunk} from "./chunk";

export abstract class System {

    public abstract get query(): Query;

    public init(){}

    public abstract update(chunk : Chunk);
}