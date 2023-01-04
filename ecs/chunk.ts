import {Query} from "./query";
import {Component} from "./component";

export class Chunk{
    public readonly query : Query;
    components : { [index : string] : Array<Component> };

    constructor(query : Query) {
        this.query = query;
    }
}