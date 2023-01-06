import assert = require("assert");

import {Entity}     from "./Entity"
import {Component}  from "./component";
import {Query}      from "./query";


export class Chunk{
    public readonly query : Query;
    public components : { [index : string] : Array<Component> } = {};
    public entities : Array<Entity> = new Array<Entity>();
    private nextIndex : number = 0;

    constructor(query : Query) {
        this.query = query;
        for (let type of query.values){
            this.components[type] = new Array<Component>();
        }
    }

    public createEntity(data : Array<Component>) : Entity{ //maybe ...data : Array<> thing for args? :)
        //todo validate data == query

        for (let component of data){
            let componentArray = this.components[component.name];
            componentArray.push(component);
        }

         return new Entity(this.entities.length, this.query); //pool?
    }

    public deleteEntity(entity : Entity){
        //todo  enforce entity is in this chunk?
        for (let type of this.query.values){
            delete this.components[type][entity.id];
        }

        delete this.entities[entity.id];
    }
}