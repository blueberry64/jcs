import {Query} from "./query";

export class Entity{
    readonly id : number
    readonly query : Query;

    constructor(in_id : number, query : Query) {
        this.id = in_id;
        this.query = query;
    }
}