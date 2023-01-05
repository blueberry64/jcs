import {Component} from "./component";

export class Query{
    public readonly values : Set<string>;

    constructor(components : Array<Component>) {
        this.values = new Set(components.map(c => c.name));
    }

    public has(other : string){
        return this.values.has(other);
    }

    public get length(){
        return this.values.size;
    }
}