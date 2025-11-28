import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {InvalidStateException} from "../common/InvalidStateException";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {MethodFailedException} from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source;
    }

    public clone(): Name {
        return super.clone();
    }

    public getNoComponents(): number {
        const length: number = this.components.length

        MethodFailedException.assert(length >= 0);

        return length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const component: string = this.components[i];

        InvalidStateException.assert(this.isValidComponent(component));

        return component;
    }

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        this.components[i] = c;

        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newComponent === c);
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const oldLength: number = this.getNoComponents();

        this.components.splice(i,0, c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(newLength - 1);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
    }

    public append(c: string): void {
        IllegalArgumentException.assert(this.isValidComponent(c))

        const oldLength: number = this.getNoComponents();

        this.components.push(c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(newLength - 1);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
    }

    public remove(i: number): void {
        IllegalArgumentException.assert(this.isValidIndex(i))
        const length: number = this.getNoComponents();

        this.components.splice(i,1);

        MethodFailedException.assert(this.getNoComponents() === length - 1);
    }
}
