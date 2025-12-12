import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {MethodFailedException} from "../../adap-b04/common/MethodFailedException";
import {InvalidStateException} from "../../adap-b04/common/InvalidStateException";
import {IllegalArgumentException} from "../../adap-b04/common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        source.forEach(component =>
            this.append(component)
        )

        MethodFailedException.assert(this.components === source);
    }

    public clone(): Name {
        return super.clone();
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

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        this.components[i] = c;

        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newComponent === c);
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const oldLength: number = this.getNoComponents();

        this.components.splice(i,0, c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
    }

    public append(c: string) {
        IllegalArgumentException.assert(this.isValidComponent(c))

        const oldLength: number = this.getNoComponents();

        this.components.push(c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(newLength - 1);

        InvalidStateException.assert(this.isValidComponent(newComponent));
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
    }

    public remove(i: number) {
        IllegalArgumentException.assert(this.isValidIndex(i))

        const oldLength: number = this.getNoComponents();

        this.components.splice(i,1);

        const newLength: number = this.getNoComponents();

        MethodFailedException.assert(newLength === oldLength - 1);
    }
}