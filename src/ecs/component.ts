export abstract class Component{
    public abstract get size() : number;

    public abstract set_values_in(offset : number, buffer : DataView);
    
    protected static set_float(offset : number, buffer : DataView, value : number) {
        buffer.setFloat32(offset, value, true);
    }
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
        Component.set_float(offset, buffer, this.x);
        Component.set_float(offset + 4, buffer, this.y);
        Component.set_float(offset + 8, buffer, this.z);
    }
}