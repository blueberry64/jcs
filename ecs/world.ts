import {Chunk}      from "./chunk"
import {Component}  from "./component";
import {Entity}     from "./entity"
import {Query}      from "./query";

export class World{
    private chunks : Array<Chunk>

    public createEntity(components : Array<Component>){
        let chunk = this.getArchetypicalChunk(query);
        let entity = new Entity();
    }

    public update(){
        //for each system
            //for each chunk matching query
                //run system using chunk
                //write changes to buffers

        //for each buffer we wrote to:
            //update entities changed in buffer
                //ie look for matching buffer chunks, write to.

        //At some point: try to do both at the same time :)
    }

    //get chunk for archetype -> when creating entity add it here
    private getArchetypicalChunk(query : Query){
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

        return this.createChunk(query);
    }

    //get all chunks with superset of query -> systems etc.
    private getMatchingChunks(query : Query) : Array<Chunk> {
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

            foundChunks.push(chunk);
        }

        return foundChunks;
    }

    private createChunk(query : Query) : Chunk{
        return new Chunk(query); //factory / pooling?
    }
}