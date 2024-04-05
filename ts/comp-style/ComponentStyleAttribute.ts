import { DisplayName, Localizable, Renderable } from "../common/interfaces";

enum Type {
    COLOR = "color",
    IMAGE = "image",
    SIZE = "size",
    SELECT = "select"
};

enum Unit {
    PIXEL = "px",
    PERCENT = "%",
    DEGREE = "deg",
    SECOND = "s",
    REM = "rem",
    EM = "em",
    VW = "vw",
    VH = "vh"
};

type Props = {
    name: string,
    displayName: DisplayName,
    value?: string,
    values?: string[],
    units?: Unit | Unit[]
};

export default class ComponentStyleAttribute implements Localizable, Renderable {

    static readonly TYPE = Type;
    static readonly UNIT = Unit;

    private _type: Type;
    private _name: string;
    private _displayName: DisplayName;
    private _value: string;
    private _values: string[];
    private _units: Unit | Unit[];

    constructor(type: Type | string, props: Props) {
        this._type = type as Type;
        this._name = props.name;
        this._displayName = props.displayName;
        this._value = props.value;
        this._values = props.values;
        this._units = props.units;
    }

    get name(): string {
        return this._name;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    getDisplayName(locale?: string): string {
        return this._displayName[locale || "default"];
    }

    getTemplate(): string {
        let template = "";
        switch (this._type) {
            case Type.COLOR:
                template = `<input type="color" value="${this._value}">`;
                break;
            case Type.IMAGE:
                template = `<input type="file" accept="image/*">`;
                break;
            case Type.SIZE:
                template = `<input type="number" value="${this._value}">`;
                if (this._units) {
                    template += `<select>${(Array.isArray(this._units) ? this._units : [this._units]).map(unit => `<option value="${unit}" ${this._value === unit ? "selected" : ""}>${unit}</option>`).join("")}</select>`;
                }
                break;
            case Type.SELECT:
                template = `<select>${this._values.map(value => `<option value="${value}" ${this._value === value ? "selected" : ""}>${value}</option>`).join("")}</select>`;
                break;
        }
        return template;
    }

}