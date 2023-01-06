export abstract class Component {
    public get name(){
        return this.constructor.name;
    }
}