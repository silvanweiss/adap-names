import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {Name} from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;

        source.forEach(component =>
            this.components.push(component)
        );
    }

    public asString(delimiter: string = this.delimiter): string {
        let unmaskedComponents: string[] = [];

        this.components.forEach(component =>
            unmaskedComponents.push(this.asUnmaskedComponent(component))
        );

        return unmaskedComponents.join(delimiter);
    }

    private asUnmaskedComponent(component: string) : string {
        const maskedDelimiter: string = ESCAPE_CHARACTER + DEFAULT_DELIMITER;
        const maskedEscapeCharacter: string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

        return component
            .replaceAll(maskedDelimiter, DEFAULT_DELIMITER)
            .replaceAll(maskedEscapeCharacter, ESCAPE_CHARACTER);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i,0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i,1);
    }

    public concat(other: Name): void {
        const length : number = other.getNoComponents();
        for (let i : number = 0; i < length; i++) {
            this.components.push(other.getComponent(i));
        }
    }

}
