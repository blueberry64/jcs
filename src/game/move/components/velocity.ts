import {Component} from "../../../ecs/component";

export class Velocity extends Component{
    public x : number; //todo make these vectors - find or make package :)
    public y : number

    constructor(x : number, y : number) {
        super();
        this.x = x;
        this.y = y;
    }
}