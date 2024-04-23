import { createUniqueId } from "../common/utils.js";
var Type;
(function (Type) {
    Type["COLOR"] = "color";
    Type["IMAGE"] = "image";
    Type["SIZE"] = "size";
    Type["SELECT"] = "select";
})(Type || (Type = {}));
;
var Unit;
(function (Unit) {
    Unit["PIXEL"] = "px";
    Unit["PERCENT"] = "%";
    Unit["DEGREE"] = "deg";
    Unit["SECOND"] = "s";
    Unit["REM"] = "rem";
    Unit["EM"] = "em";
    Unit["VW"] = "vw";
    Unit["VH"] = "vh";
})(Unit || (Unit = {}));
;
class ComponentStyleAttribute {
    constructor(type, props) {
        this._id = createUniqueId();
        this._type = type;
        this._name = props.name;
        this._displayName = props.displayName;
        this._value = props.value;
        this._values = props.values;
        this._unit = props.unit;
        this._units = props.units;
    }
    get name() {
        return this._name;
    }
    get value() {
        if (this._type === Type.SIZE && this._value) {
            return this._value.replace("|", "");
        }
        else {
            return this._value;
        }
    }
    set value(value) {
        this._value = value;
    }
    getDisplayName(locale) {
        return this._displayName[locale || "default"];
    }
    getTemplate() {
        let template = "";
        switch (this._type) {
            case Type.COLOR:
                template = `<input class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}" type="color" value="${this._value}">`;
                break;
            case Type.IMAGE:
                template = `<input class="${ComponentStyleAttribute.INPUT_CLASS_NAME}" data-id="${this._id}" type="file" accept="image/*">`;
                break;
            case Type.SIZE:
                let inputValue;
                let unitValue;
                if (this._value) {
                    const values = this._value.split("|");
                    inputValue = parseInt(values[0]);
                    unitValue = values[1];
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
    getInputValue() {
        let inputValue;
        const inputElem = document.querySelector(`.style-attribute-item > .${ComponentStyleAttribute.INPUT_CLASS_NAME}[data-id="${this._id}"]`);
        if (inputElem) {
            switch (this._type) {
                case Type.SIZE:
                    const unitElem = document.querySelector(`.style-attribute-item > .${ComponentStyleAttribute.UNIT_CLASS_NAME}[data-id="${this._id}"]`);
                    inputValue = unitElem ? parseInt(inputElem.value) + "|" + unitElem.value : parseInt(inputElem.value) + "";
                    break;
                default:
                    inputValue = inputElem.value;
            }
        }
        return inputValue;
    }
}
ComponentStyleAttribute.TYPE = Type;
ComponentStyleAttribute.UNIT = Unit;
ComponentStyleAttribute.INPUT_CLASS_NAME = "style-attribute-input";
ComponentStyleAttribute.UNIT_CLASS_NAME = "style-attribute-unit";
export default ComponentStyleAttribute;
