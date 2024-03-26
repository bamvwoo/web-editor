class Editor {
    static #COMPONENT_NAME = {
        HEADING: "Heading"
    }

    #wrapper;
    #components = {};

    constructor(id) {
        this._id = id;

        this.#init.bind(this)();
    }

    #init() {
        this.#wrapper = document.getElementById(this._id);
    }

    addComponent(componentName) {
        let component;
        switch (componentName) {
            case Editor.#COMPONENT_NAME.HEADING:
                component = new Heading();
                break;
            default:
                throw new Error("Invalid component");
        }

        component.init(this);
        this.#components[component.id] = component;

        return component;
    }

    getComponent(compId) {
        return this.#components[compId];
    }

    getWrapper() {
        return this.#wrapper;
    }
}