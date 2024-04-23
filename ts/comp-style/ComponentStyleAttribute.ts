import { DisplayName, Localizable, Renderable } from "../common/interfaces";
import { createUniqueId } from "../common/utils.js";

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
    unit?: Unit,
    units?: Unit | Unit[]
};

export default class ComponentStyleAttribute implements Localizable, Renderable {

    static readonly TYPE = Type;
    static readonly UNIT = Unit;
    static readonly INPUT_CLASS_NAME = "style-attribute-input";
    static readonly UNIT_CLASS_NAME = "style-attribute-unit";

    private _id: string;
    private _type: Type;
    private _name: string;
    private _displayName: DisplayName;
    private _value: string;
    private _values: string[];
    private _unit: Unit;
    private _units: Unit | Unit[];

    constructor(type: Type | string, props: Props) {
        this._id = createUniqueId();
        this._type = type as Type;
        this._name = props.name;
        this._displayName = props.displayName;
        this._value = props.value;
        this._values = props.values;
        this._unit = props.unit;
        this._units = props.units;
    }

    get name(): string {
        return this._name;
    }

    get value(): string {
        if (this._type === Type.SIZE && this._value) {
            return this._value.replace("|", "");
        } else {
            return this._value;
        }
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
                template = `<input class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}" type="color" value="${this._value}">`;
                break;
            case Type.IMAGE:
                template = `<input class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}" type="file" accept="image/*">`;
                break;
            case Type.SIZE:
                let inputValue: number;
                let unitValue: Unit;
                if (this._value) {
                    const values = this._value.split("|");
                    inputValue = parseInt(values[0]);
                    unitValue = values[1] as Unit;
                }

                template = `<input class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}" type="number" value="${inputValue}">`;
                if (this._units) {
                    template += `<select class="${ComponentStyleAttribute.UNIT_CLASS_NAME}" data-id="${this._id}">${(Array.isArray(this._units) ? this._units : [this._units]).map(unit => `<option value="${unit}" ${unitValue === unit ? "selected" : ""}>${unit}</option>`).join("")}</select>`;
                }
                break;
            case Type.SELECT:
                template = `<select class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}">${this._values.map(value => `<option value="${value}" ${this._value === value ? "selected" : ""}>${value}</option>`).join("")}</select>`;
                break;
        }
        return template;
    }

    getInputValue(): string {
        let inputValue: string;
        const inputElem = document.querySelector(`.style-attribute-item > .${ComponentStyleAttribute.INPUT_CLASS_NAME}[data-id="${this._id}"]`) as HTMLInputElement | HTMLSelectElement;
        if (inputElem) {
            switch (this._type) {
                case Type.SIZE:
                    const unitElem = document.querySelector(`.style-attribute-item > .${ComponentStyleAttribute.UNIT_CLASS_NAME}[data-id="${this._id}"]`) as HTMLSelectElement;
                    inputValue = unitElem ? parseInt(inputElem.value) + "|" + unitElem.value : parseInt(inputElem.value) + "";
                    break;
                default:
                    inputValue = inputElem.value;
            }
        }

        return inputValue;
    }

}