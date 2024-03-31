var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Component_instances, _Component_initStyle, _Component_getStyle;
import { createUniqueId } from "../common/utils.js";
import ComponentStyle from "./style/ComponentStyle.js";
var Name;
(function (Name) {
    Name["HEADING"] = "Heading";
    Name["COLUMN"] = "Column";
})(Name || (Name = {}));
;
class Component {
    constructor(id, props) {
        _Component_instances.add(this);
        this._id = id || createUniqueId();
        this._name = props.name;
        this._displayName = props.displayName;
        this._className = props.className;
        this._thumbnail = props.thumbnail;
        this._style = props.style ? Object.assign({}, props.style) : {};
    }
    getRange() {
        const element = this.getElement();
        const elementStyle = getComputedStyle(element);
        return {
            margin: {
                top: elementStyle.marginTop,
                right: elementStyle.marginRight,
                bottom: elementStyle.marginBottom,
                left: elementStyle.marginLeft
            },
            padding: {
                top: elementStyle.paddingTop,
                right: elementStyle.paddingRight,
                bottom: elementStyle.paddingBottom,
                left: elementStyle.paddingLeft
            }
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // 태그 생성
            this._templateElem = document.createElement("div");
            this._templateElem.id = this._id;
            this._templateElem.classList.add("comp");
            this._templateElem.classList.add(this._className);
            // 탬플릿 삽입
            const template = yield this.getTemplate();
            this._templateElem.innerHTML = template;
            // 스타일 초기화
            yield __classPrivateFieldGet(this, _Component_instances, "m", _Component_initStyle).bind(this)();
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable()) {
                throw new Error("Component is not available");
            }
            const element = this.getElement();
            element.innerHTML = yield this.getTemplate();
        });
    }
    isSelected() {
        const element = this.getElement();
        return element.classList.contains("selected");
    }
    getElement() {
        return document.getElementById(this._id);
    }
    isAvailable() {
        return this._id !== null && this.getElement() !== null;
    }
    getTemplateElement() {
        return this._templateElem;
    }
    getStyleSelector() {
        if (!this._style) {
            return this._style.selector;
        }
    }
    setStyleSelector(selector) {
        if (!this._style) {
            this._style.selector = selector;
        }
    }
    static getClass(componentName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield import("./" + componentName + ".js");
                return module.default;
            }
            catch (e) {
                return null;
            }
        });
    }
    getTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield import("../template/" + this._name + ".js");
                return module.default(this);
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
_Component_instances = new WeakSet(), _Component_initStyle = function _Component_initStyle() {
    return __awaiter(this, void 0, void 0, function* () {
        const styleItemNames = this._style.itemNames;
        if (styleItemNames) {
            let styleInstances = [];
            for (const styleName of styleItemNames) {
                styleInstances.push(yield ComponentStyle.newInstance(styleName));
            }
            this._style.items = styleInstances;
        }
    });
}, _Component_getStyle = function _Component_getStyle() {
    return this._style;
};
Component.NAME = Name;
export default Component;
