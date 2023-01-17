import assert = require("assert");

import {Entity}     from "./entity"
import {Component, ComponentClass}  from "./component";
import {Query}      from "./query";
import {Position} from "../game/move/components/position";


export type ComponentData = Map<Function, Array<Component>>;
export class Chunk{
    public readonly query : Query;
    public components : ComponentData = new Map<Function, Array<Component>>();

    public entities : Array<Entity> = new Array<Entity>();
    private nextIndex : number = 0;

    constructor(query : Query) {
        this.query = query;
        for (let type of query.values){
            this.components.set(type, new Array<Component>());
        }
    }

    public createEntity(data : Array<Component>) : Entity{ //maybe ...data : Array<> thing for args? :)
        //todo validate data == query

        for (let component of data){
            let componentArray = this.components.get(component.constructor);
            componentArray.push(component);
        }

        let entity = new Entity(this.entities.length, this.query); //pool?
        this.entities.push(entity);
        return entity;
    }

    public deleteEntity(entity : Entity){
        //todo  enforce entity is in this chunk?
        for (let type of this.query.values){
            let array = this.components.get(type);
            delete array[entity.id];
        }

        delete this.entities[entity.id];
    }

    public get<T extends Component>(componentClass : ComponentClass<T>) : T[]{
        return this.components.get(componentClass) as T[];
    }
}