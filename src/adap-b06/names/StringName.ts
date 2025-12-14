import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {IllegalArgumentException} from "../../adap-b04/common/IllegalArgumentException";
import {InvalidStateException} from "../../adap-b04/common/InvalidStateException";
import {MethodFailedException} from "../../adap-b04/common/MethodFailedException";
import {StringArrayName} from "../../adap-b02/names/StringArrayName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(this.isValidName(source));

        const sourceLength: number = this.asStringArray(source).length;

        this.name = source;
        this.noComponents = sourceLength;

        InvalidStateException.assert(this.isValidName(this.name) && this.noComponents >= 0);
        MethodFailedException.assert(this.name === source && this.noComponents === sourceLength);
    }

    public clone(): Name {
        return new StringName(this.name, super.getDelimiterCharacter());
    }

    private asStringArray(other: string): string[] {
        const nameArray: string[] = [];

        let component: string = "";
        let escapedCounter: number = 0;

        for (let i: number = 0; i < other.length; i++) {
            const char: string = other[i];

            switch (char) {
                case this.delimiter: {
                    if (escapedCounter === 0) {
                        nameArray.push(component);
                        component = "";
                    } else {
                        escapedCounter = 0;

                        component += ESCAPE_CHARACTER + this.delimiter;
                    }
                    break;
                }

                case ESCAPE_CHARACTER: {
                    escapedCounter++;

                    if (escapedCounter === 2) {
                        escapedCounter = 0;
                        component += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                    }
                    break;
                }

                default: {
                    component += char;
                }
            }
        }

        nameArray.push(component);

        return nameArray;
    }

    public getNoComponents(): number {
        const length: number = this.noComponents;

        InvalidStateException.assert(length >= 0);

        return length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const component: string = this.asStringArray(this.name)[i];

        InvalidStateException.assert(this.isValidComponent(component));

        return component;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const tempName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        tempName.setComponent(i, c);

        const newName: StringName = new StringName(tempName.asDataString(), this.delimiter);

        InvalidStateException.assert(newName.isValidName(newName.name));

        const newComponent: string = newName.getComponent(i);

        InvalidStateException.assert(newName.isValidComponent(newComponent));
        MethodFailedException.assert(newComponent === c);

        return newName;
    }

    public insert(i: number, c: string): StringName {
        IllegalArgumentException.assert(this.isValidIndex(i) && this.isValidComponent(c));

        const oldLength: number = this.noComponents;

        const tempName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        tempName.insert(i, c);

        const newName: StringName = new StringName(tempName.asDataString(), this.delimiter);

        newName.incrementNoComponents();

        InvalidStateException.assert(newName.isValidName(newName.name));

        const newComponent: string = newName.getComponent(i);

        InvalidStateException.assert(newName.isValidComponent(newComponent));

        const newLength: number = newName.noComponents;
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return newName;
    }

    public append(c: string): StringName {
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldLength: number = this.noComponents;

        const newNameString: string = this.name + this.delimiter + c;

        const newName = new StringName(newNameString, this.delimiter);

        newName.incrementNoComponents();

        InvalidStateException.assert(newName.isValidName(newName.name));

        const newComponent: string = newName.getComponent(newName.noComponents - 1);

        InvalidStateException.assert(newName.isValidComponent(newComponent));

        const newLength: number = newName.getNoComponents();
        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return newName;
    }

    public remove(i: number): StringName {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const oldLength: number = this.noComponents;

        const tempName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        tempName.remove(i);

        const newName = new StringName(tempName.asDataString(), this.delimiter);

        newName.decrementNoComponents();

        InvalidStateException.assert(newName.isValidName(newName.name));

        const newLength: number = newName.noComponents;

        MethodFailedException.assert(newLength === oldLength - 1);

        return newName;
    }

    private incrementNoComponents(): void {
        InvalidStateException.assert(this.noComponents >= 0);

        const oldLength: number = this.noComponents;

        this.noComponents += 1;

        const newLength: number = this.noComponents;

        InvalidStateException.assert(newLength >= 0);
        MethodFailedException.assert(newLength === oldLength + 1);
    }

    private decrementNoComponents(): void {
        InvalidStateException.assert(this.noComponents >= 0);

        const oldLength: number = this.noComponents;

        this.noComponents -= 1;

        const newLength: number = this.noComponents;

        InvalidStateException.assert(newLength >= 0);
        MethodFailedException.assert(newLength === oldLength - 1);
    }
}