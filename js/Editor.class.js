import ComponentClasses from "./comp/class-list.js";

export default class Editor {
    #wrapper;
    #sidebar;
    #components = {};

    constructor(id) {
        this._id = id;

        this.#init.bind(this)();
    }

    #init() {
        this.#wrapper = document.getElementById(this._id);
        this.#sidebar = document.querySelector("#" + this._id + " + aside");
        
        this.#wrapper.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        this.#wrapper.addEventListener("drop", (e) => {
            e.preventDefault();

            const compName = e.dataTransfer.getData("text/plain");
            const nextElement = e.target;

            this.addComponent(compName, null, nextElement);
        });

        this.#initSidebar();
    }

    #initSidebar() {
        let template = '<ul class="comp-list">';

        for (let compClsName in ComponentClasses) {
            const compCls = ComponentClasses[compClsName];
            const compProps = compCls.PROPS;

            template += `
                <li class="comp-item" data-name="${compProps.name}" draggable="true">
                    <img src="${compProps.thumbnail}" alt="${compProps.displayName}">
                    <p>${compProps.displayName}</p>
                </li>
            `;
        }

        template += '</ul>';

        this.#sidebar.innerHTML = template;

        this.#initSidebarHandler();
    }

    #initSidebarHandler() {
        this.#sidebar.querySelectorAll(".comp-item").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                const compName = item.dataset.name;
                e.dataTransfer.setData("text/plain", compName);
            });
        });
    }

    addComponent(componentName, options, nextTo) {
        const cls = ComponentClasses[componentName];

        let component;
        if (cls) {
            const id = options ? options.id : null;
            component = new cls(id, options);

            component.init(this, nextTo);
            if (component.isAvailable()) {
                this.#components[component.id] = component;
            }
        }
        
        return component;
    }

    getComponent(compId) {
        return this.#components[compId];
    }

    removeComponent(compId) {
        const component = this.getComponent(compId);
        if (component) {
            component.getElement().remove();
            delete this.#components[compId];
        }
    }

    getWrapper() {
        return this.#wrapper;
    }
}