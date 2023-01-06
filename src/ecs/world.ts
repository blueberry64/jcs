import {Chunk} from "./chunk"
import {Component} from "./component";
import {Query} from "./query";
import {Entity} from "./entity";
import {System} from "./system";

export class World{
    private chunks : Array<Chunk> = new Array<Chunk>();
    private updateQuerySystems : Array<[Query, Array<System>]> = new Array<[Query, Array<System>]>();

    public createEntity(...data : Array<Component>){
        let query = new Query(data);
        let chunk = this.getOrCreateArchetypeChunk(query);
        return chunk.createEntity(data);
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
    }

    public update(){
        for (let querySystemPair of this.updateQuerySystems){
            let query = querySystemPair[0];
            let systems = querySystemPair[1];

            let chunks = this.findMatchingChunks(query);
            for (let system of systems){
                for (let chunk of chunks){
                    system.update(chunk.entities, chunk.components)
                }
            }
        }
    }

    private findArchetypeChunk(query : Query) : Chunk{
        let queryLength = query.values.size;
        for (let chunk of this.chunks){
            let chunkQuery = chunk.query.values;
            if (chunkQuery.size != queryLength){
                continue;
            }

            let isMatch = true;
            for (let queryKey of chunkQuery){
                if (!query.has(queryKey)){
                    isMatch = false;
                    break;
                }
            }

            if (isMatch){
                return chunk;
            }
        }

        return null;
    }

    //get chunk for archetype -> when creating entity add it here
    private getOrCreateArchetypeChunk(query : Query) : Chunk{
        let foundChunk = this.findArchetypeChunk(query);
        if (foundChunk != null)
        {
            return foundChunk;
        }

        return this.createChunk(query);
    }

    //get all chunks with superset of query -> systems etc.
    private findMatchingChunks(query : Query) : Array<Chunk> {
        //todo some elegant functional bullshit
        //maybe cache queries somewhere so only one check / query / frame?
        let foundChunks = new Array<Chunk>; //allocate new array every time?
        for (let chunk of this.chunks){
            let chunkQuery = chunk.query.values;
            let chunkMatchesQuery = true;

            for (let type of query.values){
                if (!chunkQuery.has(type)){
                    chunkMatchesQuery = false;
                    break;
                }
            }

            if (chunkMatchesQuery)
            {
                foundChunks.push(chunk);
            }
        }

        return foundChunks;
    }

    private createChunk(query : Query) : Chunk{
        let chunk = new Chunk(query);
        this.chunks.push(chunk);
        return chunk; //factory / pooling?
    }

    private deleteEntity(entity : Entity){
        let chunk = this.findArchetypeChunk(entity.query);
        chunk.deleteEntity(entity);
    }
}