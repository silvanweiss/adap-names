import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {StringArrayName} from "../../adap-b02/names/StringArrayName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        const stringArray: string[] = this.asStringArray(source, this.delimiter)

        this.name += stringArray.join(DEFAULT_DELIMITER);
        this.noComponents = stringArray.length;
    }

    public clone(): Name {
        return super.clone();
    }

    private asStringArray(other: string, delimiter: string = DEFAULT_DELIMITER): string[] {
        const nameArray: string[] = [];

        function push(component: string) : void {
            nameArray.push(component.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER));
        }

        let component: string = "";
        let escapedCounter: number = 0;

        for (let i: number = 0; i < other.length; i++) {
            const char: string = other[i];

            switch (char) {
                case delimiter: {
                    if (escapedCounter === 0) {
                        push(component);
                        component = "";
                    } else {
                        escapedCounter = 0;

                        component += delimiter;
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
                    if (escapedCounter === 1) {
                        escapedCounter = 0;
                        component += ESCAPE_CHARACTER + char;
                    } else {
                        component += char;
                    }
                }
            }
        }

        // add rest as new component
        push(component);

        return nameArray;
    }

    // public asString(delimiter: string = this.delimiter): string {
    //     throw new Error("needs implementation or deletion");
    // }

    // public asDataString(): string {
    //     throw new Error("needs implementation or deletion");
    // }

    // public isEqual(other: Name): boolean {
    //     throw new Error("needs implementation or deletion");
    // }

    // public getHashCode(): number {
    //     throw new Error("needs implementation or deletion");
    // }

    // public isEmpty(): boolean {
    //     throw new Error("needs implementation or deletion");
    // }

    // public getDelimiterCharacter(): string {
    //     throw new Error("needs implementation or deletion");
    // }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        return this.asStringArray(this.name)[i];
    }

    public setComponent(i: number, c: string) {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.setComponent(i, c);
        this.name = newName.asDataString();
    }

    public insert(i: number, c: string) {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.insert(i, c);
        this.name = newName.asDataString();
        this.noComponents++;
    }

    public append(c: string) {
        this.name += DEFAULT_DELIMITER + c;
        this.noComponents++;
    }

    public remove(i: number) {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.remove(i);
        this.name = newName.asDataString();
        this.noComponents--;
    }

    // public concat(other: Name): void {
    //     throw new Error("needs implementation or deletion");
    // }

}