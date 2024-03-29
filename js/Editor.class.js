import ComponentClasses from "./comp/class-list.js";

export default class Editor {
    #wrapper;
    #sidebar;

    #dragging;

    #components = {};

    constructor(id) {
        this._id = id;

        this.#init.bind(this)();
    }

    #init() {
        this.#wrapper = document.getElementById(this._id);
        this.#sidebar = document.querySelector("#" + this._id + " + aside");

        this.#initComponentHandler.bind(this)();
        
        this.#initSidebar.bind(this)();

        this.#initDragging.bind(this)();
        this.#initDragAndDropHandler.bind(this)();
    }

    #initDragging() {
        this.#dragging = {
            enabled: false,
            componentName: null,
            component: null,
            element: null,
            focusedElement: null
        };
    }

    #initDragAndDropHandler() {
        // 사이드바 드래그 이벤트
        this.#sidebar.querySelectorAll(".comp-item").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                const compName = item.dataset.name;
                this.#dragging.componentName = compName;
            });
        });

        this.#wrapper.addEventListener("dragenter", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target === this.#wrapper) {
                if (this.#dragging.enabled) {
                    return;
                } else {
                    this.#dragging.enabled = true;
    
                    const compName = this.#dragging.componentName;
                    const newComponent = this.addComponent(compName);
                    const draggingElement = newComponent.getElement();

                    draggingElement.classList.add("comp-dragging");

                    this.#dragging.component = newComponent;
                    this.#dragging.element = draggingElement;
                }
            }
        });

        this.#wrapper.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!this.#dragging.enabled || e.target.classList.contains("comp-dragging")) {
                return;
            }

            const draggingElement = this.#dragging.element;
            let focusedElement = this.#dragging.focusedElement;

            if (focusedElement && focusedElement === e.target) {
                return;
            } else {
                focusedElement = e.target;
                this.#dragging.focusedElement = focusedElement;
            }

            if (focusedElement.classList.contains("comp") || focusedElement.tagName === "DIV") {
                document.querySelectorAll("div.focused").forEach((comp) => {
                    comp.classList.remove("focused", "focused-comp", "focused-div");
                });

                focusedElement.classList.add("focused");
                draggingElement.classList.add("positioned");
                
                if (focusedElement.classList.contains("comp")) {
                    focusedElement.classList.add("focused-comp");
                    focusedElement.insertAdjacentElement("afterend", draggingElement);
                } else if (focusedElement.tagName === "DIV") {
                    focusedElement.classList.add("focused-div");
                    focusedElement.appendChild(draggingElement);
                }

                setTimeout(() => {
                    draggingElement.classList.remove("positioned");
                }, 500);
            }
        });

        this.#wrapper.addEventListener("dragleave", (e) => {
            /*
            const draggingComponent = this.#dragging.component;
            this.removeComponent(draggingComponent.id);

            this.#initDragging.bind(this)();
             */
        });

        // 에디터 드롭 이벤트
        this.#wrapper.addEventListener("drop", (e) => {
            if (!this.#dragging.enabled) {
                return;
            }

            document.querySelectorAll("div.focused").forEach((comp) => {
                comp.classList.remove("focused");
            });

            const draggingElement = this.#dragging.component.getElement();
            draggingElement.classList.remove("comp-dragging");
            setTimeout(() => {
                draggingElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 100);
            
            this.#initDragging.bind(this)();
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

            // TODO : 내부 컴포넌트 삭제 필요
        }
    }

    /**
     * 컴포넌트 선택
     * @param {*} compId 
     * @param {*} e 
     */
    selectComponent(compId, e) {
        if (e) {
            e.stopPropagation();

            if (e.target.closest(".comp-tool-box")) {
                return;
            }
        }

        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const element = this.getComponentElement(compId);
        if (comp.isSelected()) {
            this.unselectComponent(compId, e);
        } else {
            document.querySelectorAll(".comp.selected").forEach((selectedComp) => {
                let selectedCompId = selectedComp.id;
                this.unselectComponent(selectedCompId, e);
            });

            element.classList.add("selected");
            this.showComponentToolBox(compId);
        }
    }

    /**
     * 
     * @param {*} compId 
     * @param {*} e 
     */
    unselectComponent(compId, e) {
        if (e) {
            e.stopPropagation();
        }

        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }

        const element = this.getComponentElement(compId);
        if (comp.isSelected()) {
            element.classList.remove("selected");
            this.hideComponentToolBox(compId);
        }
    }

    /**
     * 
     * @param {*} compId 
     */
    showComponentToolBox(compId) {
        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const toolBoxElement = document.createElement("div");
        const toolBoxTemplate = `
            <button class="btn-edit-comp">편집</button>
            <button class="btn-move-comp">이동</button>
            <button class="btn-delete-comp">삭제</button>
        `;

        toolBoxElement.classList.add("comp-tool-box");
        toolBoxElement.dataset.compId = compId;
        toolBoxElement.innerHTML = toolBoxTemplate;

        toolBoxElement.querySelector(".btn-edit-comp").addEventListener("click", (e) => {
            const compId = e.target.parentNode.dataset.compId;
        });
        toolBoxElement.querySelector(".btn-move-comp").addEventListener("click", (e) => {
            const compId = e.target.parentNode.dataset.compId;
        });
        toolBoxElement.querySelector(".btn-delete-comp").addEventListener("click", (e) => {
            const compId = e.target.parentNode.dataset.compId;
            this.removeComponent(compId);
        });
        
        const element = this.getComponentElement(compId);
        element.appendChild(toolBoxElement);
    }

    /**
     * 
     * @param {*} compId 
     */
    hideComponentToolBox(compId) {
        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }

        const element = this.getComponentElement(compId);
        element.querySelectorAll(".comp-tool-box").forEach((toolBox) => {
            toolBox.remove();
        });
    }

    /**
     * 컴포넌트 요소 범위 표시
     * @param {*} compId 
     * @returns 
     */
    showComponentRange(compId, e) {
        if (e) {
            e.stopPropagation();
        }

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
        if (e) {
            e.stopPropagation();
        }

        const element = this.getComponentElement(compId);
        if (!element) {
            return;
        }

        element.querySelectorAll(".comp > .range-box").forEach((box) => {
            box.remove();
        });
    }

}