interface IJdkVersion {
    minorVersion?: number;
    majorVersion: number;
    jdkName: string;
    parseable: boolean;
}

export class IJdkVersionImpl implements IJdkVersion {
    public parseable: boolean;
    private _jdkName: string;
    private readonly _majorVersion: number;
    private readonly _minorVersion: number | undefined;

    constructor(majorVersion: number, minorVersion?: number) {
        this._minorVersion = minorVersion ? undefined : minorVersion;
        this._majorVersion = majorVersion;
        this.validateJdk();
    }

    get majorVersion(): number {
        return this._majorVersion;
    }

    get minorVersion(): number | undefined {
        return this._minorVersion;
    }

    get jdkName(): string {
        return this._jdkName;
    }

    set jdkName(value: string) {
        this._jdkName = value;
    }

    private validateJdk() {
        switch (this.majorVersion) {
            case 45:
                this._jdkName = "Java SE 1.0";
                this.parseable = false;
                break;
            case 46:
                this._jdkName = "Java SE1.2";
                this.parseable = false;
                break;
            case 47:
                this._jdkName = "Java SE1.3";
                this.parseable = false;
                break;
            case 48:
                this._jdkName = "Java SE1.4";
                this.parseable = false;
                break;
            case 49:
                this._jdkName = "Java SE5.0";
                this.parseable = false;
                break;
            case 50:
                this._jdkName = "Java SE6.0";
                this.parseable = false;
                break;
            case 51:
                this._jdkName = "Java SE7";
                this.parseable = false;
                break;
            case 52:
                this._jdkName = "Java SE8";
                this.parseable = false;
                break;
            case 53:
                this._jdkName = "Java SE9";
                this.parseable = false;
                break;
            case 54:
                this._jdkName = "Java SE10";
                this.parseable = false;
                break;
            case 55:
                this._jdkName = "Java SE11";
                this.parseable = true;
                break;
            case 56:
                this._jdkName = "Java SE12";
                this.parseable = false;
                break;
            case 57:
                this._jdkName = "Java SE13";
                this.parseable = false;
                break;
            case 58:
                this._jdkName = "Java SE14";
                this.parseable = false;
                break;
            case 59:
                this._jdkName = "Java SE15";
                this.parseable = false;
                break;
            case 60:
                this._jdkName = "Java SE16";
                this.parseable = false;
                break;
            case 61:
                this._jdkName = "Java SE17";
                this.parseable = false;
                break;
            case 62:
                this._jdkName = "Java SE18";
                this.parseable = false;
                break;
            case 63:
                this._jdkName = "Java SE19";
                this.parseable = false;
                break;
            case 64:
                this._jdkName = "Java SE20";
                this.parseable = false;
                break;
            case 65:
                this._jdkName = "Java SE21";
                this.parseable = false;
                break;
            default:
                this._jdkName = "Unknown";
                this.parseable = false;
                break;
        }
    }
}
