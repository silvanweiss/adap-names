import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {IllegalArgumentException} from "../../adap-b04/common/IllegalArgumentException";
import {MethodFailedException} from "../../adap-b04/common/MethodFailedException";
import {InvalidStateException} from "../../adap-b04/common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));

        this.delimiter = delimiter;

        MethodFailedException.assert(this.getDelimiterCharacter() === delimiter);
    }

    public clone(): Name {
        return this;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));

        let name: string = "";

        const length: number = this.getNoComponents();

        for (let i: number = 0; i < length - 1; i++) {
            name += this.asUnmaskedComponent(this.getComponent(i)) + this.delimiter;
        }

        name += this.asUnmaskedComponent(this.getComponent(length - 1));

        return name;
    }

    protected asUnmaskedComponent(component: string): string {
        IllegalArgumentException.assert(this.isValidComponent(component));

        const maskedDelimiter: string = ESCAPE_CHARACTER + this.getDelimiterCharacter();
        const maskedEscapeCharacter: string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

        return component
            .replaceAll(maskedDelimiter, this.getDelimiterCharacter)
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
        InvalidStateException.assert(this.delimiter.length === 1);

        return this.delimiter;
    }

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;

    abstract setComponent(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        IllegalArgumentException.assert(this.isValidName(other.asDataString()));

        const thisLength: number = this.getNoComponents();
        const otherLength: number = other.getNoComponents();

        const newName: Name = this.clone();

        for (let i: number = 0; i < otherLength; i++) {
            newName.append(other.getComponent(i));
        }

        InvalidStateException.assert(this.isValidName(newName.asDataString()));
        MethodFailedException.assert(newName.getNoComponents() === thisLength + otherLength);

        return newName;
    }

    protected isValidIndex(i: number): boolean {
        return i >= 0 && i < this.getNoComponents();
    }

    protected isValidDelimiter(delimiter: string): boolean {
        return delimiter.length === 1;
    }

    protected isValidComponent(c: string): boolean {
        // if delimiter is ESCAPE_CHARACTER you cannot detect faulty masking
        if (this.delimiter === ESCAPE_CHARACTER) {
            return true;
        }

        let escapedCounter: number = 0;

        for (let i: number = 0; i < c.length; i++) {
            const char: string = c[i];

            switch (char) {
                case this.delimiter: {
                    if (escapedCounter === 1) {
                        escapedCounter = 0;
                    } else {
                        return false;
                    }
                    break;
                }

                case ESCAPE_CHARACTER: {
                    escapedCounter++;

                    if (escapedCounter === 2) {
                        escapedCounter = 0;
                    }
                    break;
                }

                default: {
                    if (escapedCounter !== 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    protected isValidName(n: string): boolean {
        // if delimiter is ESCAPE_CHARACTER you cannot detect faulty masking
        if (this.delimiter === ESCAPE_CHARACTER) {
            return true;
        }

        let escapedCounter: number = 0;

        for (let i: number = 0; i < n.length; i++) {
            const char: string = n[i];

            switch (char) {
                case this.delimiter: {
                    if (escapedCounter === 1) {
                        escapedCounter = 0;
                    }
                    break;
                }

                case ESCAPE_CHARACTER: {
                    escapedCounter++;

                    if (escapedCounter === 2) {
                        escapedCounter = 0;
                    }
                    break;
                }

                default: {
                    if (escapedCounter !== 0) {
                        return false;
                    }
                }
            }
        }

        return true
    }

}