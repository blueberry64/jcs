import {Component} from "./component";

export class Query{
    public readonly values : Set<string>;

    constructor(components : Array<Component>) {
        this.values = new Set(components.map(c => c.name));
    }

    public has(other : string) : boolean {
        return this.values.has(other);
    }

    public get length() : number {
        return this.values.size;
    }

    public matches(other : Query) : boolean{
        if (other.length !== this.length){
            return false;
        }

        for (let value of other.values){
            if (!this.has(value)){
                return false;
            }
        }

        return true;
    }
}