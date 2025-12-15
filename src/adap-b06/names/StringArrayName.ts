import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        this.components = source;

        MethodFailedException.assert(this.components === source);
    }

    public clone(): Name {
        const newName = new StringArrayName(this.components, this.delimiter);
        MethodFailedException.assert(this.isEqual(newName));
        return newName;
    }

    public getNoComponents(): number {
        const length: number = this.components.length

        InvalidStateException.assert(length >= 0);

        return length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const component: string = this.components[i];

        InvalidStateException.assert(this.isValidComponent(component));

        return component;
    }

    public setComponent(i: number, c: string): StringArrayName {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const newComponents: string[] = [...this.components];

        newComponents[i] = c;

        const newName: StringArrayName = new StringArrayName(newComponents, this.delimiter);

        const newComponent: string = newName.getComponent(i);

        InvalidStateException.assert(newName.isValidComponent(newComponent));
        MethodFailedException.assert(newComponent === c);

        return newName;
    }

    public insert(i: number, c: string): StringArrayName {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const oldLength: number = this.getNoComponents();

        const newComponents: string[] = [...this.components];

        newComponents.splice(i,0, c);

        const newName: StringArrayName = new StringArrayName(newComponents, this.delimiter);

        const newLength: number = newName.getNoComponents();
        const newComponent: string = newName.getComponent(i);

        InvalidStateException.assert(newName.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return newName;
    }

    public append(c: string): StringArrayName {
        IllegalArgumentException.assert(this.isValidComponent(c))

        const oldLength: number = this.getNoComponents();

        const newComponents: string[] = [...this.components];

        newComponents.push(c);

        const newName: StringArrayName = new StringArrayName(newComponents, this.delimiter);

        const newLength: number = newName.getNoComponents();
        const newComponent: string = newName.getComponent(newLength - 1);

        InvalidStateException.assert(newName.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return newName;
    }

    public remove(i: number): StringArrayName {
        IllegalArgumentException.assert(this.isValidIndex(i))

        const oldLength: number = this.getNoComponents();

        const newComponents: string[] = [...this.components];

        newComponents.splice(i,1);

        const newName: StringArrayName = new StringArrayName(newComponents, this.delimiter);

        const newLength: number = newName.getNoComponents();

        MethodFailedException.assert(newLength === oldLength - 1);

        return newName;
    }
}