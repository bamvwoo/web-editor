import { createUniqueId } from "../utils.js";
import ComponentStyle from "../comp-style/ComponentStyle.js";

export default class Component {
    static NAME_HEADING = "Heading";
    static NAME_COLUMN = "Column";

    #temporaryElement;
    #style = {};

    constructor(id, props) {
        if (this.constructor === Component) {
            throw new Error("Cannot create an instance of abstract class");
        }

        this._id = id || createUniqueId();
        this._name = props.name;
        this._displayName = props.displayName;
        this._className = props.className;
        this._thumbnail = props.thumbnail;
        this._style = props.style ? { ...props.style } : {};
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get displayName() {
        return this._displayName.default;
    }

    set displayName(displayName) {
        this._displayName.default = displayName;
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
        }
    }

    async init() {
        // 태그 생성
        this.#temporaryElement = document.createElement("div");
        this.#temporaryElement.id = this._id;

        this.#temporaryElement.classList.add("comp");
        this.#temporaryElement.classList.add(this._className);

        // 탬플릿 삽입
        const template = await this.getTemplate();
        this.#temporaryElement.innerHTML = template;

        // 스타일 초기화
        await this.#initStyle.bind(this)();        
    }

    async #initStyle() {
        const styleItems = this._style.items;
        if (styleItems) {
            let styleInstances = [];
            for (const styleName of styleItems) {
                const styleCls = await ComponentStyle.getClass(styleName);
                if (styleCls) {
                    styleInstances.push(new styleCls());
                }
            }
            
            this._style.items = styleInstances;
        }
    }

    async render() {
        if (!this.isAvailable()) {
            throw new Error("Component is not available");
        }

        const element = this.getElement();
        element.innerHTML = await this.getTemplate();
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

    getTemporaryElement() {
        return this.#temporaryElement;
    }

    getStyleSelector() {
        if (!this._style) {
            this._style = {};
        }
        return this._style.selector;
    }

    setStyleSelector(selector) {
        if (!this._style) {
            this._style = {};
        }
        this._style.selector = selector;
    }

    #getStyle() {
        return this._style;
    }

    setStyle(any, value, clear) {
        clear = clear === undefined ? false : clear;

        const newStyle = clear ? {} : this.#getStyle();
        if (any instanceof Object) {
            for (let key in any) {
                newStyle[key] = any[key];
            }
        } else if (typeof any === "string") {
            newStyle[any] = value;
        }

        this.#applyStyle(newStyle, clear);
    }

    #applyStyle(style, clear) {
        const element = this.getElement();
        const styleSelector = this.getStyleSelector();

        let targetElement;
        if (styleSelector) {
            targetElement = element.querySelector(styleSelector);
        } else {
            targetElement = element;
        }

        if (targetElement) {
            if (clear) {
                targetElement.style.cssText = "";
            }

            for (let key in style) {
                targetElement.style[key] = style[key];
            }
        }

        this.#style = style;
    }

    static async getClass(componentName) {
        try {
            const module = await import("./" + componentName + ".js");
            return module.default;
        } catch (e) {
            return null;
        }
    }

    async getTemplate() {
        try {
            const module = await import("../template/" + this._name + ".js");
            return module.default(this);
        } catch (e) {
            return null;
        }
    }

    static getComponentNames() {
        const staticKeys = Object.keys(Component).filter(key => key.startsWith("NAME_"));
        return staticKeys.map(key => Component[key]);
    }
}