import {Component} from "./component";

export class Query{
    public readonly values : Set<Function>;
    public readonly asArray : Array<Function>;

    constructor(...components : Array<Function>) {
        this.values = new Set(components);
        this.asArray = [...components];
    }

    public has(other : Function) : boolean {
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