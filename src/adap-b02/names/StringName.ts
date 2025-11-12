import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {StringArrayName} from "./StringArrayName";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.name += source.replaceAll(this.delimiter, DEFAULT_DELIMITER); //TODO mask before ?
        this.noComponents = this.asStringArray(this.name).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const maskedDelimiter: string = ESCAPE_CHARACTER + DEFAULT_DELIMITER;
        //const maskedEscapeCharacter: string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

        return this.name.replaceAll(maskedDelimiter, delimiter);
            //.replaceAll(maskedEscapeCharacter, ESCAPE_CHARACTER); // TODO: brauch ich masked escape character überhaut?
    }

    public asDataString(): string {
        return this.name;
    }

    private asStringArray(other: string, delimiter: string = DEFAULT_DELIMITER): string[] {
        const nameArray: string[] = [];

        let component: string = "";
        let counter: number = 0;

        for (let i: number = 0; i < other.length; i++) {
            const char: string = other[i];

            switch (char) {
                case delimiter:
                    if (counter % 2 === 0) {
                        nameArray.push(component);
                        component = "";
                        counter = 0;
                        continue;
                    }
                    break;

                case ESCAPE_CHARACTER:
                    counter++;
                    break;
            }
            component += char;
        }

        nameArray.push(component);
        return nameArray;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        return this.asStringArray(this.name)[x];
    }

    public setComponent(n: number, c: string): void {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.setComponent(n, c);
        this.name = newName.asDataString();
    }

    public insert(n: number, c: string): void {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.insert(n, c);
        this.name = newName.asDataString();
        this.noComponents++;
    }

    public append(c: string): void {
        this.name += DEFAULT_DELIMITER + c;
        this.noComponents++;
    }

    public remove(n: number): void {
        const newName: StringArrayName = new StringArrayName(this.asStringArray(this.name));
        newName.remove(n);
        this.name = newName.asDataString();
        this.noComponents--;
    }

    public concat(other: Name): void {
        this.name += other.asDataString();
        this.noComponents += other.getNoComponents();
    }

}
