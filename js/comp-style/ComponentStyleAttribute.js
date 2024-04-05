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
        this._type = type;
        this._name = props.name;
        this._displayName = props.displayName;
        this._value = props.value;
        this._values = props.values;
        this._units = props.units;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
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
ComponentStyleAttribute.TYPE = Type;
ComponentStyleAttribute.UNIT = Unit;
export default ComponentStyleAttribute;
