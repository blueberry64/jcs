import {Query} from "./query";
import {Entity} from "./entity";
import {Chunk, ComponentData} from "./chunk";
import {Component, ComponentClass} from "./component";

export abstract class System{ //todo generic-ify? https://github.com/Microsoft/TypeScript/pull/26063b
    public query: Query = null;

    public abstract init();

    public abstract update(entities : Array<Entity>, getComponentData: <T extends Component>(componentType : ComponentClass<T>) => T[]);

    public get requiresForUpdate() {
        return this.query;
    }
}