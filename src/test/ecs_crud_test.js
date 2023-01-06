const assert = require('assert');
const chai  = require("chai")

const {World} = require("../../build/ecs/world");
const {Component} = require("../../build/ecs/component");
const {deepEqual} = require("assert");
const {Position} = require("../game/move/components/position");
const {Velocity} = require("../game/move/components/velocity");

class Color extends Component{
    constructor(label) {
        super();
        this.color = label;
    }
}

describe('Create Entity', function () {

    let world = new World();

    world.createEntity([new Color("red"), new Position(), new Velocity()])
    world.createEntity([new Position, new Velocity(), new Color("red")]);

    it ("should have one chunk", function (){
        let numChunks = world.chunks.length;
        assert(numChunks === 1);
    });

    it('both should have position {1, 2, 3}, velocity {4, 5, 6}, color:red', function () {
        let components = world.chunks[0].components;
        let positions  = components["Position"];
        let velocities = components["Velocity"];
        let colors     = components["Color"];

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

    for (let i = 0; i < 1000; i++){
        x_pos = Math.random();
        y_pos = Math.random();

        x_vel = Math.random();
        y_vel = Math.random();

        world.createEntity(new Position(), new Velocity());
    }

    assert(world.chunks.length === 1);
    assert(world.chunks[0].entities.length === 1000);

});
