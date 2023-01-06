import {Query} from "./query";
import {Component} from "./component";
import {Entity} from "./entity";

export abstract class System{ //todo generic-ify? https://github.com/Microsoft/TypeScript/pull/26063b
    public query: Query = null;

    public abstract init();

    public abstract update(entities : Array<Entity>, componentData : { [index : string] : Array<Component> });

    public get requiresForUpdate() {
        return this.query;
    }
}