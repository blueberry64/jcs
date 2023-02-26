import {System} from "../../../ecs/system";
import {Velocity} from "../components/velocity";
import {Position} from "../components/position";
import {Chunk} from "../../../ecs/chunk";

export class MoveSystem extends System {
    get exclude_for_update(): Function[] {
        return [];
    }

    get include_for_update(): Function[] {
        return [Position, Velocity];
    }

    public update(chunk : Chunk) {
        const positions = chunk.get(Position);
        const velocities = chunk.get(Velocity);

        let position, velocity =  0;
        for (let offset = 0; offset < positions.byteLength; offset += 4) {
            position = System.read_float(positions, offset);
            velocity = System.read_float(velocities, offset);
            System.set_float(positions, offset, position + velocity);//position + velocity);
        }
    }
}