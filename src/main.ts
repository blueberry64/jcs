import {World} from "./ecs/world";
import {Position} from "./game/move/components/position";
import {Velocity} from "./game/move/components/velocity";

console.log("hello");
let world = new World();


const numEntities = Math.pow(2, 24);
let x_pos, y_pos, x_vel, y_vel;
for (let i = 0; i < numEntities; i++) {
    x_pos = Math.random();
    y_pos = Math.random();

    x_vel = Math.random();
    y_vel = Math.random();

    world.createEntity(new Position(x_pos, y_pos), new Velocity(x_vel, y_vel));
}

console.log("goodbye");