import {Component} from "../../../ecs/component"; //todo figure out why absolute path not working

export class Position extends Component{
    public x : number;
    public y : number;

    constructor(x : number, y : number) {
        super();
        this.x = x;
        this.y = y;
    }
}