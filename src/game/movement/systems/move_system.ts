import {System} from "../../../ecs/system";
import {Velocity} from "../components/velocity";
import {Position} from "../components/position";

export class MoveSystem extends System {
    public update(chunk: ArrayBuffer) {
        //todo, make this not hardcoded

        for (let byteIndex = 0; byteIndex < chunk.byteLength; byteIndex++) {
            chunk[byteIndex] += 5;
        }
    }

    get exclude_for_update(): Function[] {
        return [];
    }

    get include_for_update(): Function[] {
        return [Position, Velocity];
    }
}