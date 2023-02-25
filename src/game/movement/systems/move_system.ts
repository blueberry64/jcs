import {System} from "../../../ecs/system";
import {Velocity} from "../components/velocity";
import {Position} from "../components/position";
import {QueryFactory} from "../../../ecs/query";

export class MoveSystem extends System {
    get exclude_for_update(): Function[] {
        return [];
    }

    get include_for_update(): Function[] {
        return [Position, Velocity];
    }

    public update(num_entities : number, chunk_data : Map<Function, DataView>) {
        const positions = chunk_data.get(Position);
        const velocities = chunk_data.get(Velocity);

        let position, velocity =  0;
        for (let offset = 0; offset < positions.byteLength; offset += 4) {
            position = positions.getFloat32(offset, true);
            velocity = velocities.getFloat32(offset, true);
            positions.setFloat32(offset, position + velocity, true);//position + velocity);
        }
    }
}