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
;
var AttributeType;
(function (AttributeType) {
    AttributeType["COLOR"] = "color";
    AttributeType["IMAGE"] = "image";
    AttributeType["SIZE"] = "size";
    AttributeType["SELECT"] = "select";
})(AttributeType || (AttributeType = {}));
;
class ComponentStyle {
    constructor(name, props) {
        this._name = name;
        this._displayName = props.displayName;
        this._attributes = props.attributes ? props.attributes : [];
    }
    static newInstance(styleName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield import("./" + styleName + ".js");
                return module.default();
            }
            catch (e) {
                return null;
            }
        });
    }
    getDisplayName(locale) {
        return this._displayName[locale || "default"];
    }
}
ComponentStyle.PROPS = {};
ComponentStyle.NAME = Name;
ComponentStyle.ATTRIBUTE_TYPE = AttributeType;
export default ComponentStyle;
