import fs from "fs";
import crypto from "crypto";
import path from "path";
import { IJdkVersionImpl } from "./types";

const _CAFEBABE = 0xcafebabe;

class ClassFileReader {
    private readonly _filePath: string;
    private readonly _JDK: IJdkVersionImpl;
    private readonly _buffer: Buffer;
    private readonly _stat: fs.Stats;
    public readonly debug: boolean;
    private readonly _md5: string;
    public readonly constantPoolArray: any[];

    constructor(filePath: string, debug = true) {
        this._filePath = filePath;
        this._buffer = fs.readFileSync(path.resolve(__dirname, this._filePath));
        this._stat = fs.statSync(path.resolve(__dirname, this._filePath));
        this.validateMagicNumber();
        this._JDK = this.parseJdk();
        this.debug = debug;
        this._md5 = crypto.createHash("md5").update(this._buffer).digest("hex");
        this.constantPoolArray = [];

        if (!this._JDK.parseable) {
            throw new Error(
                `Not supported .class file: Your version is ${this._JDK.jdkName}, supported is Java SE11 `,
            );
        }

        if (debug) {
            this.debugInformation();
        }
    }

    private validateMagicNumber(): void {
        const magicNumber = this._buffer.readUint32BE(0);

        if (magicNumber !== _CAFEBABE) {
            throw new Error(
                "Invalid .class file: Magic number does not match 0xCAFEBABE",
            );
        }
    }

    private parseJdk() {
        const minorVersion = this._buffer.readUint16BE(4);
        const majorVersion = this._buffer.readUint16BE(6);
        return new IJdkVersionImpl(majorVersion, minorVersion);
    }

    public parseConstantPool() {
        let offset = 8;
        const constantPoolCount = this._buffer.readUint16BE(offset);
        offset += 2;
        for (let i = 1; i < constantPoolCount; i++) {
            const tag = this._buffer.readUint8(offset);

            switch (tag) {
                case 1: {
                    const length = this._buffer.readUint16BE(offset + 1);
                    const bytes = this._buffer.slice(
                        offset + 3,
                        offset + 3 + length,
                    );
                    const value = bytes.toString("utf8");

                    this.constantPoolArray[i] = { tag, value };
                    offset += 3 + length;
                    break;
                }
                case 3: {
                    const value = this._buffer.readInt32BE(offset + 1);
                    this.constantPoolArray[i] = { tag, value };
                    offset += 5;
                    break;
                }
                case 4: {
                    const value = this._buffer.readFloatBE(offset + 1);

                    this.constantPoolArray[i] = { tag, value };
                    offset += 5;
                    break;
                }

                case 5: {
                    const value = this._buffer.readBigInt64BE(offset + 1);

                    this.constantPoolArray[i] = { tag, value };
                    offset += 9;
                    i++;
                    break;
                }

                case 6: {
                    const highBytes = this._buffer.readUInt32BE(offset + 1);
                    const lowBytes = this._buffer.readUInt32BE(offset + 5);
                    const doubleValue = new Float64Array(new Uint32Array([lowBytes, highBytes]).buffer)[0];

                    this.constantPoolArray[i] = { tag, value: doubleValue };
                    offset += 9;
                    i++;
                    break;
                }
                case 7: {
                    const nameIndex = this._buffer.readUint16BE(offset + 1);
                    this.constantPoolArray[i] = { tag, nameIndex };
                    offset += 3;
                    break;
                }
                case 8: {
                    const stringIndex = this._buffer.readUint16BE(offset + 1);
                    this.constantPoolArray[i] = { tag, stringIndex };
                    offset += 3;
                    break;
                }
                case 9: {
                    const classIndex = this._buffer.readUint16BE(offset + 1);
                    const nameAndTypeIndex = this._buffer.readUint16BE(
                        offset + 3,
                    );

                    this.constantPoolArray[i] = {
                        tag,
                        classIndex,
                        nameAndTypeIndex,
                    };
                    offset += 5;
                    break;
                }
                case 10: {
                    const classIndex = this._buffer.readUint16BE(offset + 1);
                    const nameAndTypeIndex = this._buffer.readUint16BE(
                        offset + 3,
                    );

                    this.constantPoolArray[i] = {
                        tag,
                        classIndex,
                        nameAndTypeIndex,
                    };
                    offset += 5;
                    break;
                }
                case 12: {
                    const nameIndex = this._buffer.readUint16BE(offset + 1);
                    const descriptorIndex = this._buffer.readUint16BE(offset + 3);

                    this.constantPoolArray[i] = { tag, nameIndex, descriptorIndex };
                    offset += 5;
                    break;
                }

                default: {
                    throw new Error(`Unrecognized constant pool tag: ${tag}`);
                }
            }
        }
    }

    private debugInformation() {
        console.log(`Classfile ${path.resolve(__dirname, this._filePath)}`);
        console.log(
            `Last modified ${this._stat.ctime}; size ${this._stat.size} bytes`,
        );
        console.log(`MD5 checksum ${this._md5}`);
    }
}

try {
    const reader = new ClassFileReader("../resources/TestClass.class");
    reader.parseConstantPool();
    console.log(reader.constantPoolArray);
} catch (error) {
    console.error(error);
}
