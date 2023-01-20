export abstract class Component {
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T
