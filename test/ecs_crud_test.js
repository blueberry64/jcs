const assert = require('assert');
const {World} = require("../build/ecs/world");
const {Component} = require("../build/ecs/component");

class Position extends Component {
    x = 1;
    y = 2;
    z = 3;
}

class Velocity extends Component{
    x = 1;
    y = 2;
    z = 3;
}

class Color extends Component{
    color = "red";
}

describe('Create Entity', function () {

    let world = new World();

    world.createEntity([new Color(), new Position(), new Velocity()])
    world.createEntity([new Position, new Velocity(), new Color()]);

    it ("should have one chunk", function (){
        let numChunks = world.chunks.length;
        console.assert(numChunks === 1);
    });

    it('both should have position {1, 2, 3}, velocity {4, 5, 6}, color:red', function () {
        let components = world.chunks[0].components;
        console.log(components["Position"]);
        console.log(components["Velocity"]);
        console.log(components["Color"]);

        console.assert(components.length === 2);

    });

});
