import {Component} from "./component";

export class Query{
    public readonly values : Set<string>;

    constructor(components : Array<Component>) {
        this.values = new Set(components.map(c => typeof c));
    }

    public has(other : string){
        return this.values.has(other);
    }
}