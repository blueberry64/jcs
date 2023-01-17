import {System} from "../../../ecs/system";
import {Query} from "../../../ecs/query";
import {Position} from "../components/position";
import {Velocity} from "../components/velocity";
import {Entity} from "../../../ecs/entity";
import {Component, ComponentClass} from "../../../ecs/component";
import {ComponentData} from "../../../ecs/chunk";

export class MoveSystem extends System{
    init() {
        this["query"] = new Query(Position, Velocity);
    }

    public override update (entities : Array<Entity>, getComponentData: <T extends Component>(componentType : ComponentClass<T>) => T[]) {
        let positions = getComponentData(Position);
        const velocities = getComponentData(Velocity);

        //should this be one entity or whole chunk? chunk for now.
        for (let entity of entities){
            positions[entity.id].x += velocities[entity.id].x;
        }
    }
}
