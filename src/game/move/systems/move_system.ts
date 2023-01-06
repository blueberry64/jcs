import {System} from "../../../ecs/system";
import {Query} from "../../../ecs/query";
import {Position} from "../components/position";
import {Velocity} from "../components/velocity";
import {Entity} from "../../../ecs/entity";
import {Component} from "../../../ecs/component";

export class MoveSystem extends System{
    init() {
        this.query = new Query(typeof Position, typeof Velocity);
    }

    update(entities : Array<Entity>, componentData :{ [index : string] : Array<Component> }) {
        let positions = componentData[typeof Position];
        let velocities = componentData[typeof Velocity];

        //should this be one entity or whole chunk? chunk for now.
        for (let entity of entities){
            positions[entity.id].x += velocities[entity.id].x;
        }
    }
}
