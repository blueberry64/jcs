import {Component} from "./component";

export class Query{
    public readonly components : Array<Component>;
    public readonly as_set : Set<string>;
    public readonly sizeof_entity : number;
    public get length() : number { return this.components.length; }

    constructor(...components : Array<Component>) {
        this.components = components;
        this.components.sort((a, b) => a.name.localeCompare(b.name));
        this.as_set = new Set(components.map(c => c.name));
        for (const component of components){
            this.sizeof_entity += component.size;
        }
    }

    public is_superset_of(other : Query) : boolean {
        if (other.length != this.length) {
            return false;
        }

        for (const val of other.components) {
            if (!this.as_set.has(val.name)) {
                return false;
            }
        }

        return true;
    }

    public matches (other : Query) : boolean {
        return (this.length === other.length) && (this.is_superset_of(other));
    }
}