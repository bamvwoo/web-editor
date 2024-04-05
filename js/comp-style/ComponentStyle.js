var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Name;
(function (Name) {
    Name["FONT"] = "Font";
    Name["BACKGROUND"] = "Background";
    Name["BORDER"] = "Border";
})(Name || (Name = {}));
;
class ComponentStyle {
    constructor(name, props) {
        this._name = name;
        this._displayName = props.displayName;
        this._attributes = props.attributes ? props.attributes : [];
    }
    get name() {
        return this._name;
    }
    get attributes() {
        return this._attributes;
    }
    static newInstance(styleName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield import("./" + styleName + ".js");
                return new module.default();
            }
            catch (e) {
                return null;
            }
        });
    }
    getDisplayName(locale) {
        return this._displayName[locale || "default"];
    }
    getTemplate() {
        let template = `<ul class="style-attribute-list" data-name="${this._name}">`;
        for (let attribute of this._attributes) {
            template += `
                <li class="style-attribute-item" data-name="${this._name.toLowerCase()}-${attribute.name}">
                    <label>${attribute.getDisplayName()}</label>
                    ${attribute.getTemplate()}
                </li>
            `;
        }
        template += "</ul>";
        return template;
    }
    getStyleAttributes() {
        return this._attributes;
    }
    getStyleAttribute(name) {
        return this._attributes.find(attribute => attribute.name === name);
    }
    setStyleAttribute(name, value) {
        const attribute = this.getStyleAttribute(name);
        if (attribute) {
            attribute.value = value;
        }
    }
}
ComponentStyle.PROPS = {};
ComponentStyle.NAME = Name;
export default ComponentStyle;
