import ComponentStyle from "./comp-style/ComponentStyle";
import Component from "../js/comp/Component.js";
import { openModal } from "./common/utils.js";

type Dragging = {
    enabled: boolean;
    componentName: string;
    component: Component;
    element: HTMLElement;
    focusedElement: HTMLElement;
};

export default class Editor {
    private _id: string;
    private _wrapper: HTMLElement;
    private _sidebar: HTMLElement;
    private _dragging: Dragging;
    private _components: { [key: string]: Component } = {};

    constructor(id: string) {
        this._id = id;

        this.init.bind(this)();
    }

    private async init(): Promise<void> {
        this._wrapper = document.getElementById(this._id);
        this._sidebar = document.querySelector("#" + this._id + " + aside");

        this.initComponentHandler.bind(this)();
        
        await this.initSidebar.bind(this)();

        this.initDragging.bind(this)();
        this.initDragAndDropHandler.bind(this)();
    }

    private initDragging(): void {
        this._dragging = {
            enabled: false,
            componentName: null,
            component: null,
            element: null,
            focusedElement: null
        };
    }

    private initDragAndDropHandler(): void {
        // 사이드바 드래그 이벤트
        this._sidebar.querySelectorAll(".comp-item").forEach((item: HTMLElement) => {
            item.addEventListener("dragstart", (e) => {
                const compName: string = item.dataset.name;
                this._dragging.componentName = compName;
            });
        });

        this._wrapper.addEventListener("dragenter", async (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if ((e.target as HTMLElement) === this._wrapper) {
                if (this._dragging.enabled) {
                    return;
                } else {
                    this._dragging.enabled = true;
    
                    const compName: string = this._dragging.componentName;
                    const newComponent: Component = await this.addComponent(compName);
                    const draggingElement: HTMLElement = newComponent.getElement();

                    draggingElement.classList.add("comp-dragging");

                    this._dragging.component = newComponent;
                    this._dragging.element = draggingElement;
                }
            }
        });

        this._wrapper.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const target: HTMLElement = e.target as HTMLElement;
            if (!this._dragging.enabled || target.classList.contains("comp-dragging")) {
                return;
            }

            const draggingElement: HTMLElement = this._dragging.element;
            let focusedElement: HTMLElement = this._dragging.focusedElement;

            if (!draggingElement || (focusedElement && focusedElement === target)) {
                return;
            } else {
                focusedElement = target;
                this._dragging.focusedElement = focusedElement;
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

        this._wrapper.addEventListener("dragleave", (e: DragEvent) => {
            /*
            const draggingComponent = this.#dragging.component;
            this.removeComponent(draggingComponent.id);

            this.#initDragging.bind(this)();
             */
        });

        // 에디터 드롭 이벤트
        this._wrapper.addEventListener("drop", (e: DragEvent) => {
            if (!this._dragging.enabled) {
                return;
            }

            document.querySelectorAll("div.focused").forEach((comp) => {
                comp.classList.remove("focused");
            });

            const draggingElement: HTMLElement = this._dragging.component.getElement();
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
        this._wrapper.addEventListener("click", (e: MouseEvent) => {
            const target: HTMLElement = (e.target as HTMLElement).closest(".comp");
            if (target) {
                const compId: string = target.id;
                this.selectComponent(compId, e);
            }
        });

        this._wrapper.addEventListener("mouseover", (e: MouseEvent) => {
            if (this._dragging.enabled) {
                return;
            }

            const target: HTMLElement = (e.target as HTMLElement).closest(".comp");
            if (target) {
                const compId: string = target.id;
                this.showComponentRange(compId, e);
            }
        });

        this._wrapper.addEventListener("mouseout", (e: MouseEvent) => {
            if (this._dragging.enabled) {
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
            const compCls: typeof Component = await Component.getClass(compNames[compName]);
            const compProps = compCls.PROPS;

            template += `
                <li class="comp-item" data-name="${compProps.name}" draggable="true">
                    <img src="${compProps.thumbnail}" alt="${compProps.displayName.default}">
                    <p>${compProps.displayName.default}</p>
                </li>
            `;
        }

        template += '</ul>';

        this._sidebar.innerHTML = template;
    }

    private getWrapper(): HTMLElement {
        return this._wrapper;
    }

    async addComponent(componentName: string, options?: { id?: string, size?: number, content?: string }, nextTo?: HTMLElement): Component {
        const cls: typeof Component = await Component.getClass(componentName);

        let component: Component;
        if (cls) {
            const id: string = options ? options.id : null;
            
            component = new cls(id, options);
            await component.init();

            const templateElement = component.getTemplateElement();
            if (nextTo) {
                nextTo.insertAdjacentElement("afterend", templateElement);
            } else {
                this.getWrapper().appendChild(templateElement);
            }

            if (component.isAvailable()) {
                this._components[component.id] = component;
            }
        }
        
        return component;
    }

    public getComponent(compId: string): Component {
        return this._components[compId];
    }

    public getComponentElement(compId: string): HTMLElement {
        const component: Component = this.getComponent(compId);
        return component ? component.getElement() : null;
    }

    public removeComponent(compId: string): void {
        const component: Component = this.getComponent(compId);
        if (component) {
            component.getElement().remove();
            delete this._components[compId];

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
            this.openStyleEditingModal(compId);
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

    /**
     * 
     * @param compId 
     * @param callback 
     * @returns 
     */
    openStyleEditingModal(compId: string, callback?: Function): void {
        const comp: Component = this.getComponent(compId);
        if (!comp) {
            return;
        }
        
        let modalTemplate: string = "";
        const styleItems: ComponentStyle[] = comp.getStyleItems();
        for (let styleItem of styleItems) {
            modalTemplate += styleItem.getTemplate();
        }

        openModal(modalTemplate, {
            title: "스타일 편집",
            confirmText: "적용"
        }, async (modal) => {
            let styleItemElems: NodeListOf<Element> = modal.querySelectorAll(".style-attribute-list");
            for (let styleItemElem of styleItemElems) {
                const styleItemName: string = (styleItemElem as HTMLElement).dataset.name;
                const styleItem: ComponentStyle = comp.getStyleItem(styleItemName);

                if (styleItem) {
                    const styleAttrElems: NodeListOf<Element> = styleItemElem.querySelectorAll(".style-attribute-item");
                    for (let styleAttrElem of styleAttrElems) {
                        const styleAttrName: string = (styleAttrElem as HTMLElement).dataset.name;
                        styleItem.setStyleAttribute(styleAttrName, ""); // TODO : 입력된 값을 가져오는 메서드 구현 필요
                    }
                }
            }

            await comp.render();
        });
    }
}