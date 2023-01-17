import {System} from "../../../ecs/system";
import {Query} from "../../../ecs/query";
import {Position} from "../components/position";
import {Velocity} from "../components/velocity";
import {Entity} from "../../../ecs/entity";
import {Component, ComponentClass} from "../../../ecs/component";
import {Chunk, ComponentData} from "../../../ecs/chunk";

export class MoveSystem extends System{

    private q = new Query(Position, Velocity);

    public override get query(): Query {
        return this.q;
    }

    public override update(entities : Array<Entity>, chunk : Chunk) {
        let positions = chunk.get(Position);
        const velocities = chunk.get(Velocity);

        //should this be one entity or whole chunk? chunk for now.
        for (let entity of entities){
            positions[entity.id].x += velocities[entity.id].x;
        }
    }
}
