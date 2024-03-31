import Component from "../js/comp/Component.js";

export default class Editor {
    private id: string;
    private wrapper: HTMLElement;
    private sidebar: HTMLElement;
    private dragging: { 
        enabled: boolean, 
        componentName: string, 
        component: Component, 
        element: HTMLElement, 
        focusedElement: HTMLElement
    };
    private components: { [key: string]: Component } = {};

    constructor(id: string) {
        this.id = id;

        this.init.bind(this)();
    }

    private async init(): Promise<void> {
        this.wrapper = document.getElementById(this.id);
        this.sidebar = document.querySelector("#" + this.id + " + aside");

        this.initComponentHandler.bind(this)();
        
        await this.initSidebar.bind(this)();

        this.initDragging.bind(this)();
        this.initDragAndDropHandler.bind(this)();
    }

    private initDragging(): void {
        this.dragging = {
            enabled: false,
            componentName: null,
            component: null,
            element: null,
            focusedElement: null
        };
    }

    private initDragAndDropHandler(): void {
        // 사이드바 드래그 이벤트
        this.sidebar.querySelectorAll(".comp-item").forEach((item: HTMLElement) => {
            item.addEventListener("dragstart", (e) => {
                const compName: string = item.dataset.name;
                this.dragging.componentName = compName;
            });
        });

        this.wrapper.addEventListener("dragenter", async (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if ((e.target as HTMLElement) === this.wrapper) {
                if (this.dragging.enabled) {
                    return;
                } else {
                    this.dragging.enabled = true;
    
                    const compName: string = this.dragging.componentName;
                    const newComponent: Component = await this.addComponent(compName);
                    const draggingElement: HTMLElement = newComponent.getElement();

                    draggingElement.classList.add("comp-dragging");

                    this.dragging.component = newComponent;
                    this.dragging.element = draggingElement;
                }
            }
        });

        this.wrapper.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const target: HTMLElement = e.target as HTMLElement;
            if (!this.dragging.enabled || target.classList.contains("comp-dragging")) {
                return;
            }

            const draggingElement: HTMLElement = this.dragging.element;
            let focusedElement: HTMLElement = this.dragging.focusedElement;

            if (!draggingElement || focusedElement && focusedElement === target) {
                return;
            } else {
                focusedElement = target;
                this.dragging.focusedElement = focusedElement;
            }

            if (focusedElement.classList.contains("comp") || focusedElement.tagName === "DIV") {
                document.querySelectorAll("div.focused").forEach((compElem: HTMLElement) => {
                    compElem.classList.remove("focused", "focused-comp", "focused-div");
                });
                
                draggingElement.classList.add("positioned");
                
                try {
                    if (focusedElement.classList.contains("comp")) {
                        // 현재 포커스된 요소가 컴포넌트인 경우
                        if (e.pageY < focusedElement.offsetTop + focusedElement.offsetHeight / 2) {
                            // 마우스 포인터가 컴포넌트의 상단에 위치한 경우 -> 컴포넌트 앞에 삽입
                            focusedElement.insertAdjacentElement("beforebegin", draggingElement);
                        } else {
                            // 마우스 포인터가 컴포넌트의 하단에 위치한 경우 -> 컴포넌트 뒤에 삽입
                            focusedElement.insertAdjacentElement("afterend", draggingElement);
                        }
                    } else if (focusedElement.tagName === "DIV") {
                        // 현재 포커스된 요소가 DIV인 경우 -> DIV 내부에 삽입
                        focusedElement.appendChild(draggingElement);
                    }
    
                    setTimeout(() => {
                        draggingElement.classList.remove("positioned");
                    }, 500);
                } catch (e) {
                    // do nothing
                }
            }
        });

        this.wrapper.addEventListener("dragleave", (e: DragEvent) => {
            /*
            const draggingComponent = this.#dragging.component;
            this.removeComponent(draggingComponent.id);

            this.#initDragging.bind(this)();
             */
        });

        // 에디터 드롭 이벤트
        this.wrapper.addEventListener("drop", (e: DragEvent) => {
            if (!this.dragging.enabled) {
                return;
            }

            document.querySelectorAll("div.focused").forEach((comp) => {
                comp.classList.remove("focused");
            });

            const draggingElement: HTMLElement = this.dragging.component.getElement();
            draggingElement.classList.remove("comp-dragging");
            setTimeout(() => {
                draggingElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 100);
            
            this.initDragging.bind(this)();
        });
    }

    private initComponentHandler(): void {
        // 컴포넌트 클릭 이벤트
        this.wrapper.addEventListener("click", (e: MouseEvent) => {
            const target: HTMLElement = (e.target as HTMLElement).closest(".comp");
            if (target) {
                const compId: string = target.id;
                this.selectComponent(compId, e);
            }
        });

        this.wrapper.addEventListener("mouseover", (e: MouseEvent) => {
            if (this.dragging.enabled) {
                return;
            }

            const target: HTMLElement = (e.target as HTMLElement).closest(".comp");
            if (target) {
                const compId: string = target.id;
                this.showComponentRange(compId, e);
            }
        });

        this.wrapper.addEventListener("mouseout", (e: MouseEvent) => {
            if (this.dragging.enabled) {
                console.log("work");
                
                return;
            }

            const target: HTMLElement = (e.target as HTMLElement).closest(".comp");
            if (target) {
                const compId: string = target.id;
                this.hideComponentRange(compId, e);
            }
        });
    }

    private async initSidebar(): Promise<void> {
        let template: string = '<ul class="comp-list">';

        const compNames = Component.NAME;
        for (let compName in compNames) {
            const compCls: typeof Component = await Component.getClass(compName);
            const compProps = compCls.PROPS;

            template += `
                <li class="comp-item" data-name="${compProps.name}" draggable="true">
                    <img src="${compProps.thumbnail}" alt="${compProps.displayName.default}">
                    <p>${compProps.displayName.default}</p>
                </li>
            `;
        }

        template += '</ul>';

        this.sidebar.innerHTML = template;
    }

    private getWrapper(): HTMLElement {
        return this.wrapper;
    }

    async addComponent(componentName: string, options?: { id?: string, size?: number, content?: string }, nextTo?: HTMLElement): Component {
        const cls: typeof Component = await Component.getClass(componentName);

        let component: Component;
        if (cls) {
            const id: string = options ? options.id : null;
            
            component = new cls(id, options);
            await component.init();

            const temporaryElement = component.getTemporaryElement();
            if (nextTo) {
                nextTo.insertAdjacentElement("afterend", temporaryElement);
            } else {
                this.getWrapper().appendChild(temporaryElement);
            }

            if (component.isAvailable()) {
                this.components[component.id] = component;
            }
        }
        
        return component;
    }

    public getComponent(compId: string): Component {
        return this.components[compId];
    }

    public getComponentElement(compId: string): HTMLElement {
        const component: Component = this.getComponent(compId);
        return component ? component.getElement() : null;
    }

    public removeComponent(compId: string): void {
        const component: Component = this.getComponent(compId);
        if (component) {
            component.getElement().remove();
            delete this.components[compId];

            // TODO : 내부 컴포넌트 삭제 필요
        }
    }

    /**
     * 컴포넌트 선택
     * @param compId
     * @param e 
     * @returns 
     */
    selectComponent(compId: string, e: MouseEvent): void {
        if (e) {
            e.stopPropagation();

            if ((e.target as HTMLElement).closest(".comp-tool-box")) {
                return;
            }
        }

        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const element: HTMLElement = this.getComponentElement(compId);
        if (comp.isSelected()) {
            this.unselectComponent(compId, e);
        } else {
            document.querySelectorAll(".comp.selected").forEach((selectedComp: HTMLElement) => {
                let selectedCompId: string = selectedComp.id;
                this.unselectComponent(selectedCompId, e);
            });

            element.classList.add("selected");
            this.showComponentToolBox(compId);
        }
    }

    /**
     * 컴포넌트 선택 해제
     * @param compId 
     * @param e 
     * @returns 
     */
    unselectComponent(compId: string, e: MouseEvent): void {
        if (e) {
            e.stopPropagation();
        }

        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }

        const element: HTMLElement = this.getComponentElement(compId);
        if (comp.isSelected()) {
            element.classList.remove("selected");
            this.hideComponentToolBox(compId);
        }
    }

    /**
     * 
     * @param compId 
     * @returns 
     */
    showComponentToolBox(compId: string): void {
        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const toolBoxElement: HTMLElement = document.createElement("div");
        const toolBoxTemplate: string = `
            <button class="btn-edit-comp">편집</button>
            <button class="btn-move-comp">이동</button>
            <button class="btn-delete-comp">삭제</button>
        `;

        toolBoxElement.classList.add("comp-tool-box");
        toolBoxElement.dataset.compId = compId;
        toolBoxElement.innerHTML = toolBoxTemplate;

        toolBoxElement.querySelector(".btn-edit-comp").addEventListener("click", (e) => {
            const compId: string = ((e.target as Node).parentNode as HTMLElement).dataset.compId;
        });
        toolBoxElement.querySelector(".btn-move-comp").addEventListener("click", (e) => {
            const compId: string = ((e.target as Node).parentNode as HTMLElement).dataset.compId;
        });
        toolBoxElement.querySelector(".btn-delete-comp").addEventListener("click", (e) => {
            const compId: string = ((e.target as Node).parentNode as HTMLElement).dataset.compId;
            this.removeComponent(compId);
        });
        
        const element: HTMLElement = this.getComponentElement(compId);
        element.appendChild(toolBoxElement);
    }

    /**
     * 
     * @param compId 
     * @returns 
     */
    hideComponentToolBox(compId: string): void {
        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }

        const element: HTMLElement = this.getComponentElement(compId);
        element.querySelectorAll(".comp-tool-box").forEach((toolBox: HTMLElement) => {
            toolBox.remove();
        });
    }

    /**
     * 컴포넌트 요소 범위 표시
     * @param compId 
     * @param e 
     * @returns 
     */
    showComponentRange(compId: string, e: MouseEvent): void {
        if (e) {
            e.stopPropagation();
        }

        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        const element: HTMLElement = this.getComponentElement(compId);
        const elementStyle: CSSStyleDeclaration = getComputedStyle(element);

        type Range = { margin: { top: string, right: string, bottom: string, left: string }, padding: { top: string, right: string, bottom: string, left: string } };
        const range: Range = comp.getRange();

        // Margin Box 생성
        for (let position in range.margin) {
            const boxElement: HTMLElement = document.createElement("span");
            boxElement.classList.add("range-box", "margin-box", "margin-" + position + "-box");
            
            const value: string = range.margin[position];
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

                boxElement.style.top = "0";
            }

            element.appendChild(boxElement);
        }

        // Padding Box 생성
        for (let position in range.padding) {
            const boxElement: HTMLElement = document.createElement("span");
            boxElement.classList.add("range-box", "padding-box", "padding-" + position + "-box");
            
            const value: string = range.padding[position];
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
    hideComponentRange(compId: string, e: MouseEvent): void {
        if (e) {
            e.stopPropagation();
        }

        const element: HTMLElement = this.getComponentElement(compId);
        if (!element) {
            return;
        }

        element.querySelectorAll(".comp > .range-box").forEach((box: HTMLElement) => {
            box.remove();
        });
    }

}