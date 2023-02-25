export abstract class Component{
    public abstract get size() : number;

    public abstract set_values_in(offset : number, buffer : DataView);
}

export class Vector3 extends Component {
    public x: number;
    public y: number;
    public z: number;

    public get size() {
        return 3 * 4;
    }

    constructor(x: number, y: number, z: number) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }

    public set_values_in(offset: number, buffer: DataView) {
        buffer.setFloat32(offset, this.x, true);
        buffer.setFloat32(offset + 4, this.y, true);
        buffer.setFloat32(offset + 8, this.z, true);
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
