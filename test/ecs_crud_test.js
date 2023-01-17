const assert = require('assert');
const chai  = require("chai")
const {deepEqual} = require("assert");
const {Component} = require("../build/ecs/component");
const {Position} = require("../build/game/move/components/position");
const {Velocity} = require("../build/game/move/components/velocity");
const {MoveSystem} = require("../build/game/move/systems/move_system");
const {World} = require("../build/ecs/world");


class Color extends Component{
    constructor(label) {
        super();
        this.color = label;
    }
}

describe('Create Entity', function () {

    let world = new World();

    world.createEntity(new Color("red"), new Position(0, 0), new Velocity(0, 0))
    world.createEntity(new Position(0, 0), new Velocity(0, 0), new Color("red"));

    it ("should have one chunk", function (){
        let numChunks = world.chunks.length;
        assert(numChunks === 1);
    });

    it('both should have position {1, 2, 3}, velocity {4, 5, 6}, color:red', function () {
        let chunk = world.chunks[0];
        let positions  = chunk.get(Position);
        let velocities = chunk.get(Velocity);
        let colors     = chunk.get(Color);

        assert(positions.length !== 0)
        assert(positions.length === velocities.length);
        assert(positions.length === colors.length);

        let testComponents = (componentArray) => {
            chai.expect(componentArray[0]).to.eql(componentArray[1]);
        }

        testComponents(positions);
        testComponents(velocities);
        testComponents(colors);
    });
});

describe("Move System", function (){
    let world = new World();

    const numEntities = Math.pow(2, 10);
    let x_pos, y_pos, x_vel, y_vel;
    for (let i = 0; i < numEntities; i++) {
        x_pos = Math.random();
        y_pos = Math.random();

        x_vel = Math.random();
        y_vel = Math.random();

        world.createEntity(new Position(x_pos, y_pos), new Velocity(x_vel, y_vel));
    }

    it ("should have one chunk", function (){
        assert(world.chunks.length === 1);
    });

    it("should have 1000 entities", function (){
        assert(world.chunks[0].entities.length === numEntities);
    });

    world.registerSystem(new MoveSystem());
    it ( "should have one system", function (){
        assert(world.updateQuerySystems.length === 1);
    })

    //just for fun
    for (let i = 0; i < 1000; i++){
        world.update();
    }
});
