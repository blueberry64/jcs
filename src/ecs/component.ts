export abstract class Component{
    public abstract get size() : number;
    public get name() : string { return this.constructor.name; }
}

export class Vector3 extends Component {
    public x: number;
    public y: number;
    public z: number;

    public get size() {
        return 3 * 8;
    }

    constructor(x: number, y: number, z: number) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class Num {
    public value : number;

    public get size() {
        return 8;
    }

    constructor(value : number) {
        this.value = value;
    }
}
