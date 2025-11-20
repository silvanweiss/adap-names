import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return this;
    }

    public asString(delimiter: string = this.delimiter): string {
        let name = "";

        const length: number = this.getNoComponents();

        for (let i: number = 0; i < length - 1; i++) {
            name += this.asUnmaskedComponent(this.getComponent(i)) + this.delimiter;
        }

        name += this.asUnmaskedComponent(this.getComponent(length - 1));

        return name;
    }

    protected asUnmaskedComponent(component: string): string{
        const maskedDelimiter: string = ESCAPE_CHARACTER + DEFAULT_DELIMITER;
        const maskedEscapeCharacter: string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

        return component
            .replaceAll(maskedDelimiter, DEFAULT_DELIMITER)
            .replaceAll(maskedEscapeCharacter, ESCAPE_CHARACTER);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let name: string = "";

        const length: number = this.getNoComponents();

        for (let i: number = 0; i < length - 1; i++) {
            name += this.getComponent(i) + this.delimiter;
        }

        name += this.getComponent(length - 1);

        return name;
    }

    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        const name: string = this.toString()
        let hash: number = 0;

        for (const char of name) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0;
        }

        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const length: number = this.getNoComponents();

        for (let i: number = 0; i < length; i++) {
            this.append(other.getComponent(i));
        }
    }
}
