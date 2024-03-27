import ComponentClasses from "./comp/class-list.js";

export default class Editor {
    #wrapper;
    #components = {};

    constructor(id) {
        this._id = id;

        this.#init.bind(this)();
    }

    #init() {
        this.#wrapper = document.getElementById(this._id);
    }

    addComponent(componentName, options) {
        const cls = ComponentClasses[componentName];

        let component;
        if (cls) {
            component = new cls(null, options);

            component.init(this);
            if (component.isAvailable()) {
                this.#components[component.id] = component;
            }
        }
        
        return component;
    }

    getComponent(compId) {
        return this.#components[compId];
    }

    getWrapper() {
        return this.#wrapper;
    }
}