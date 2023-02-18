import assert = require("assert");

import {Component}  from "./component";
import {Query}      from "./query";

export class Chunk{
    private static readonly entities_per_chunk = 512; //page size = 256kb? https://github.com/danbev/learning-v8/blob/master/notes/heap.md
                                                       //want ~128 bytes per entity?
                                                       //1024 * 128 
    private data_buffer : ArrayBuffer;
    private data_views : Map<string, DataView>;
    public entities : Uint32Array = new Uint32Array(Chunk.entities_per_chunk).fill(0);
    private last_new_index = -1;

    public archetype_query : Query;

    constructor(query : Query){
        this.data_buffer = new ArrayBuffer(Chunk.entities_per_chunk * query.sizeof_entity);
        this.archetype_query = query;

        let offset = 0;
        for (let component of query.components){
            const view_length = Chunk.entities_per_chunk * component.size;
            this.data_views.set(component.name, new DataView(this.data_buffer, offset, view_length));
            offset += view_length;
        }
    }

    public query_for(componentType : Function) {
        return this.data_views.get(componentType.name);
    }

    private find_next_index() : number {
        for (let i = this.last_new_index + 1; i < this.entities.length; i++) {
            if (this.entities[i] === 0) {
                return i;
            }
        }

        for (let i = 0; i < this.last_new_index; i++) {
            if (this.entities[i] === 0) {
                return i;
            }
        }

        return -1;
    }

    public create_entity(id : number, data: Component[]) : boolean {
        const index = this.find_next_index();
        if (index < 0) {
            return false;
        }

        this.entities[index] = id;

    }
}