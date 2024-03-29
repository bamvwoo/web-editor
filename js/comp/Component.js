import { createUniqueId } from "../utils.js";

export default class Component {
    #templateElement;

    constructor(id, props) {
        if (this.constructor === Component) {
            throw new Error("Cannot create an instance of abstract class");
        }

        this._id = id || createUniqueId();
        this._name = props.name;
        this._displayName = props.displayName;
        this._className = props.className;
        this._thumbnail = props.thumbnail;
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
        this.#templateElement = document.createElement("div");
        this.#templateElement.id = this._id;

        this.#templateElement.classList.add("comp");
        this.#templateElement.classList.add(this._className);

        // 탬플릿 삽입
        const template = await this.getTemplate();
        this.#templateElement.innerHTML = template;

        return this.#templateElement;
    }

    async render() {
        if (!this.isAvailable()) {
            throw new Error("Component is not available");
        }

        const element = await this.getElement();
        element.innerHTML = this.getTemplate();
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

    setStyle(element, any, value) {
        if (element) {
            if (any instanceof Object) {
                for (let key in any) {
                    element.style[key] = any[key];
                }
            } else if (typeof any === "string") {
                element.style[any] = value;
            }
        }
    }

    static async getClass(componentName) {
        const module = await import("./" + componentName + ".js");
        return module.default;
    }

    async getTemplate() {
        const module = await import("../template/" + this._name + ".js");
        const template = module.default(this);
        return template;
    }
}