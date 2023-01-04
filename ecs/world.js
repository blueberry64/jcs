"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var World = /** @class */ (function () {
    function World() {
    }
    World.prototype.createEntity = function (components) {
        //check if archetype exists
        var archetypeExists = false;
        var chunks = this.getChunks(components);
        //get chunks for archetype (or make one if not)
        //add entity to smallest chunk for archetype
        //ie add each component to the array in the chunk for it.
    };
    World.prototype.update = function () {
        //for each system
        //for each chunk matching query
        //run system using chunk
        //write changes to buffers
        //for each buffer we wrote to:
        //update entities changed in buffer
        //ie look for matching buffer chunks, write to.
        //At some point: try to do both at the same time :)
    };
    World.prototype.getChunks = function (components) {
        return null;
    };
    return World;
}());
exports.World = World;
