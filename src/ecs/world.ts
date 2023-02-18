import {Chunk} from "./chunk"
import {Component} from "./component";
import {Query} from "./query";
import {Entity} from "./entity";
import {System} from "./system";

export class World{
    private chunks : Array<Chunk> = new Array<Chunk>();
    private updateQuerySystems : Array<[Query, Array<System>]> = new Array<[Query, Array<System>]>();

    private next_entity_id = 1;

    public createEntity(query : Query, ...data : Array<Component>) {
        let chunk = this.getOrCreateArchetypeChunk(query);

        let id = this.next_entity_id;
        this.next_entity_id++;
        chunk.create_entity(data);
    }

    public registerSystem(system : System){
        for (let querySystemPair of this.updateQuerySystems) {
            let query = querySystemPair[0];
            let systems = querySystemPair[1];

            if (query.matches(system.query)){
                systems.push(system);
                return;
            }
        }

        this.updateQuerySystems.push([system.query, new Array<System>(system)]);
        system.init();
    }

    public update() {
        for (let querySystemPair of this.updateQuerySystems) {
            let query = querySystemPair[0];
            let systems = querySystemPair[1];

            let chunks = this.findMatchingChunks(query);
            for (let system of systems) {
                for (let chunk of chunks) {
                    system.update(chunk.entities, chunk);
                }
            }
        }
    }

    private findArchetypeChunk(query : Query) : Chunk {
        for (let chunk of this.chunks){
            if (chunk.archetype_query.matches(query)) {
                return chunk;
            }
        }

        return null;
    }

    //get chunk for archetype -> when creating entity add it here
    private getOrCreateArchetypeChunk(query : Query) : Chunk {
        let foundChunk = this.findArchetypeChunk(query);
        if (foundChunk != null) {
            return foundChunk;
        }

        return this.createChunk(query);
    }

    //get all chunks with superset of query -> systems etc.
    private findMatchingChunks(query : Query) : Array<Chunk> {
        //maybe cache queries somewhere so only one check / query / frame?
        let foundChunks = new Array<Chunk>; //allocate new array every time?
        for (let chunk of this.chunks) {
            if (chunk.archetype_query.is_superset_of(query)) {
                foundChunks.push(chunk);
            }
        }

        return foundChunks;
    }

    private createChunk(query : Query) : Chunk {
        let chunk = new Chunk(query);
        this.chunks.push(chunk);
        return chunk; //factory / pooling?
    }
}