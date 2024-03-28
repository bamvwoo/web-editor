import ComponentClasses from "./comp/class-list.js";

export default class Editor {
    #wrapper;
    #sidebar;
    #components = {};
    #dragging = {
        enabled: false,
        componentName: null,
        component: null
    };

    constructor(id) {
        this._id = id;

        this.#init.bind(this)();
    }

    #init() {
        this.#wrapper = document.getElementById(this._id);
        this.#sidebar = document.querySelector("#" + this._id + " + aside");

        this.#initComponentHandler.bind(this)();
        
        this.#initSidebar.bind(this)();
        this.#initDragAndDropHandler.bind(this)();
    }

    #initDragAndDropHandler() {
        // 사이드바 드래그 이벤트
        this.#sidebar.querySelectorAll(".comp-item").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                const compName = item.dataset.name;
                this.#dragging.componentName = compName;
            });
        });

        const dragenterHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target === this.#wrapper) {
                if (this.#dragging.enabled) {
                    return;
                } else {
                    this.#dragging.enabled = true;
    
                    const compName = this.#dragging.componentName;
                    const newComponent = this.addComponent(compName);
                    this.#dragging.component = newComponent;
                }
            }
        }

        const dragoverHandler = (e) => {
            e.preventDefault();

            if (e.target === this.#wrapper || !this.#dragging.enabled) {
                return;
            }

            console.log("work");

            if (this.#dragging.component) {
                const draggingElement = this.#dragging.component.getElement();
                const nextElement = e.target;

                // nextElement.insertAdjacentElement("afterend", draggingElement);
                nextElement.appendChild(draggingElement);
            }
        };

        this.#wrapper.addEventListener("dragenter", dragenterHandler);
        this.#wrapper.addEventListener("dragleave", dragoverHandler);

        // 에디터 드롭 이벤트
        this.#wrapper.addEventListener("drop", (e) => {
            e.preventDefault();

            if (e.target === this.#wrapper || !this.#dragging.enabled) {
                return;
            }

            if (this.#dragging.component) {
                this.removeComponent(this.#dragging.component.id);

                const compName = this.#dragging.componentName;
                const nextElement = e.target;

                this.addComponent(compName, null, nextElement);
            }

            this.#dragging = {
                enabled: false,
                componentName: null,
                component: null
            };
        });
    }

    #initComponentHandler() {
        // 컴포넌트 클릭 이벤트
        this.#wrapper.addEventListener("click", (e) => {
            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.selectComponent(compId, e);
            }
        });

        this.#wrapper.addEventListener("mouseover", (e) => {
            if (this.#dragging.enabled) {
                return;
            }

            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.showComponentRange(compId, e);
            }
        });

        this.#wrapper.addEventListener("mouseout", (e) => {
            if (this.#dragging.enabled) {
                return;
            }

            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.hideComponentRange(compId, e);
            }
        });
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
    }

    #getWrapper() {
        return this.#wrapper;
    }

    addComponent(componentName, options, nextTo) {
        const cls = ComponentClasses[componentName];

        let component;
        if (cls) {
            const id = options ? options.id : null;
            component = new cls(id, options);

            const templateElement = component.init();
            if (nextTo) {
                nextTo.insertAdjacentElement("afterend", templateElement);
            } else {
                this.#getWrapper().appendChild(templateElement);
            }

            if (component.isAvailable()) {
                this.#components[component.id] = component;
            }
        }
        
        return component;
    }

    getComponent(compId) {
        return this.#components[compId];
    }

    getComponentElement(compId) {
        const component = this.getComponent(compId);
        return component ? component.getElement() : null;
    }

    removeComponent(compId) {
        const component = this.getComponent(compId);
        if (component) {
            component.getElement().remove();
            delete this.#components[compId];
        }
    }

    /**
     * 컴포넌트 선택
     * @param {*} compId 
     * @param {*} e 
     */
    selectComponent(compId, e) {
        e.stopPropagation();

        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const element = this.getComponentElement(compId);
        if (comp.isSelected()) {
            element.classList.remove("selected");
        } else {
            document.querySelectorAll(".comp.selected").forEach((comp) => {
                comp.classList.remove("selected");
            });

            element.classList.add("selected");
        }
    }

    /**
     * 컴포넌트 요소 범위 표시
     * @param {*} compId 
     * @returns 
     */
    showComponentRange(compId, e) {
        e.stopPropagation();

        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const element = this.getComponentElement(compId);
        const elementStyle = getComputedStyle(element);
        const range = comp.getRange();

        // Margin Box 생성
        for (let position in range.margin) {
            const boxElement = document.createElement("span");
            boxElement.classList.add("range-box", "margin-box", "margin-" + position + "-box");
            
            const value = range.margin[position];
            if (position === "top" || position === "bottom") {
                boxElement.style.width = parseFloat(elementStyle.width) + (
                    parseFloat(range.margin.left) + parseFloat(range.margin.right)
                ) + "px";
                boxElement.style.height = value;

                if (position === "top") {
                    boxElement.style.top = "-" + value;
                } else {
                    boxElement.style.bottom = "-" + value;
                }

                boxElement.style.left = "-" + range.margin.left;
            } else if (position === "left" || position === "right") {
                boxElement.style.width = value;
                boxElement.style.height = elementStyle.height;

                if (position === "left") {
                    boxElement.style.left = "-" + value;
                } else {
                    boxElement.style.right = "-" + value;
                }

                boxElement.style.top = 0;
            }

            element.appendChild(boxElement);
        }

        // Padding Box 생성
        for (let position in range.padding) {
            const boxElement = document.createElement("span");
            boxElement.classList.add("range-box", "padding-box", "padding-" + position + "-box");
            
            const value = range.padding[position];
            if (position === "top" || position === "bottom") {
                boxElement.style.width = elementStyle.width;
                boxElement.style.height = value;
            } else if (position === "right" || position === "left") {
                boxElement.style.top = range.padding.top;
                boxElement.style.width = value;
                boxElement.style.height = parseFloat(elementStyle.height) - (
                    parseFloat(range.padding.top) + parseFloat(range.padding.bottom)
                ) + "px";
            }

            element.appendChild(boxElement);
        }
    }

    /**
     * 컴포넌트 요소 범위 숨김
     * @param {*} compId 
     * @param {*} e 
     */
    hideComponentRange(compId, e) {
        e.stopPropagation();

        const element = this.getComponentElement(compId);
        if (!element) {
            return;
        }

        element.querySelectorAll(".comp > .range-box").forEach((box) => {
            box.remove();
        });
    }

}