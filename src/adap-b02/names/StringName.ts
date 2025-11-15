import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {StringArrayName} from "./StringArrayName";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.name += this.asStringArray(source, this.delimiter).join(DEFAULT_DELIMITER);
        this.noComponents = this.asStringArray(this.name).length;
    }

    // unmask all special characters and replace delimiter
    public asString(delimiter: string = this.delimiter): string {
        return this.asUnmaskedStringName(this.asStringArray(this.name).join(delimiter));
    }

    // this thing is so complex because it should handle non default masked delimiter like "#" and the masked "\\#"
    private asStringArray(other: string, delimiter: string = DEFAULT_DELIMITER): string[] {
        const nameArray: string[] = [];

        // Remask the default delimiter so no information is lost when switching delimiter
        function push(component: string) : void {
            nameArray.push(component.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER));
        }

        let component: string = "";
        let escapedCounter: number = 0;

        // Count the escape characters to determine if delimiter is masked or not
        for (let i: number = 0; i < other.length; i++) {
            const char: string = other[i];

            switch (char) {
                case delimiter: {
                    // unmasked delimiter found (".") -> split
                    if (escapedCounter === 0) {
                        push(component);
                        component = "";
                    // masked delimiter found ("\\.") -> add it to component
                    } else {
                        escapedCounter = 0;

                        // remove masking from all delimiters "\\#" -> "#" and "\\." -> "."
                        component += delimiter;
                    }
                    break;
                }

                case ESCAPE_CHARACTER: {
                    escapedCounter += 1;

                    // masked escape character found ("\\\\") -> reset counter
                    if (escapedCounter === 2) {
                        escapedCounter = 0;
                        component += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                    }
                    break;
                }

                default: {
                    // "normal" character or DEFAULT_DELIMITER found -> reset counter
                    // !!! This should not happen !!! -> INPUT NOT CORRECTLY MASKED
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

    // remove masking: "\\." -> "." and "\\\\" -> "\\"
    private asUnmaskedStringName(other: string, delimiter: string = DEFAULT_DELIMITER) : string {
        const maskedDelimiter: string = ESCAPE_CHARACTER + delimiter;
        const maskedEscapeCharacter: string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

        return other
            .replaceAll(maskedDelimiter, delimiter)
            .replaceAll(maskedEscapeCharacter, ESCAPE_CHARACTER);
    }

    public asDataString(): string {
        return this.name;
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

    // TODO: how is the new string masked, only the escape char, the default delimiter or the current delimiter?
    public setComponent(n: number, c: string): void {
        const newName: Name = new StringArrayName(this.asStringArray(this.name));
        newName.setComponent(n, c);
        this.name = newName.asDataString();
    }

    // TODO: how is the new string masked, only the escape char, the default delimiter or the current delimiter?
    public insert(n: number, c: string): void {
        const newName: Name = new StringArrayName(this.asStringArray(this.name));
        newName.insert(n, c);
        this.name = newName.asDataString();
        this.noComponents++;
    }

    // TODO: how is the new string masked, only the escape char, the default delimiter or the current delimiter?
    public append(c: string): void {
        this.name += DEFAULT_DELIMITER + c;
        this.noComponents++;
    }

    public remove(n: number): void {
        const newName: Name = new StringArrayName(this.asStringArray(this.name));
        newName.remove(n);
        this.name = newName.asDataString();
        this.noComponents--;
    }

    public concat(other: Name): void {
        this.name += other.asDataString();
        this.noComponents += other.getNoComponents();
    }

}
