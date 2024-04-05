var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Component from "../js/comp/Component.js";
import { openModal } from "./common/utils.js";
export default class Editor {
    constructor(id) {
        this._components = {};
        this._id = id;
        this.init.bind(this)();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._wrapper = document.getElementById(this._id);
            this._sidebar = document.querySelector("#" + this._id + " + aside");
            this.initComponentHandler.bind(this)();
            yield this.initSidebar.bind(this)();
            this.initDragging.bind(this)();
            this.initDragAndDropHandler.bind(this)();
        });
    }
    initDragging() {
        this._dragging = {
            enabled: false,
            componentName: null,
            component: null,
            element: null,
            focusedElement: null
        };
    }
    initDragAndDropHandler() {
        // 사이드바 드래그 이벤트
        this._sidebar.querySelectorAll(".comp-item").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                const compName = item.dataset.name;
                this._dragging.componentName = compName;
            });
        });
        this._wrapper.addEventListener("dragenter", (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === this._wrapper) {
                if (this._dragging.enabled) {
                    return;
                }
                else {
                    this._dragging.enabled = true;
                    const compName = this._dragging.componentName;
                    const newComponent = yield this.addComponent(compName);
                    const draggingElement = newComponent.getElement();
                    draggingElement.classList.add("comp-dragging");
                    this._dragging.component = newComponent;
                    this._dragging.element = draggingElement;
                }
            }
        }));
        this._wrapper.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;
            if (!this._dragging.enabled || target.classList.contains("comp-dragging")) {
                return;
            }
            const draggingElement = this._dragging.element;
            let focusedElement = this._dragging.focusedElement;
            if (!draggingElement || (focusedElement && focusedElement === target)) {
                return;
            }
            else {
                focusedElement = target;
                this._dragging.focusedElement = focusedElement;
            }
            if (focusedElement.classList.contains("comp") || focusedElement.tagName === "DIV") {
                document.querySelectorAll("div.focused").forEach((compElem) => {
                    compElem.classList.remove("focused", "focused-comp", "focused-div");
                });
                draggingElement.classList.add("positioned");
                try {
                    if (focusedElement.classList.contains("comp")) {
                        // 현재 포커스된 요소가 컴포넌트인 경우
                        if (e.pageY < focusedElement.offsetTop + focusedElement.offsetHeight / 2) {
                            // 마우스 포인터가 컴포넌트의 상단에 위치한 경우 -> 컴포넌트 앞에 삽입
                            focusedElement.insertAdjacentElement("beforebegin", draggingElement);
                        }
                        else {
                            // 마우스 포인터가 컴포넌트의 하단에 위치한 경우 -> 컴포넌트 뒤에 삽입
                            focusedElement.insertAdjacentElement("afterend", draggingElement);
                        }
                    }
                    else if (focusedElement.tagName === "DIV") {
                        // 현재 포커스된 요소가 DIV인 경우 -> DIV 내부에 삽입
                        focusedElement.appendChild(draggingElement);
                    }
                    setTimeout(() => {
                        draggingElement.classList.remove("positioned");
                    }, 500);
                }
                catch (e) {
                    // do nothing
                }
            }
        });
        this._wrapper.addEventListener("dragleave", (e) => {
            /*
            const draggingComponent = this.#dragging.component;
            this.removeComponent(draggingComponent.id);

            this.#initDragging.bind(this)();
             */
        });
        // 에디터 드롭 이벤트
        this._wrapper.addEventListener("drop", (e) => {
            if (!this._dragging.enabled) {
                return;
            }
            document.querySelectorAll("div.focused").forEach((comp) => {
                comp.classList.remove("focused");
            });
            const draggingElement = this._dragging.component.getElement();
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
    initComponentHandler() {
        // 컴포넌트 클릭 이벤트
        this._wrapper.addEventListener("click", (e) => {
            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.selectComponent(compId, e);
            }
        });
        this._wrapper.addEventListener("mouseover", (e) => {
            if (this._dragging.enabled) {
                return;
            }
            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.showComponentRange(compId, e);
            }
        });
        this._wrapper.addEventListener("mouseout", (e) => {
            if (this._dragging.enabled) {
                console.log("work");
                return;
            }
            const target = e.target.closest(".comp");
            if (target) {
                const compId = target.id;
                this.hideComponentRange(compId, e);
            }
        });
    }
    initSidebar() {
        return __awaiter(this, void 0, void 0, function* () {
            let template = '<ul class="comp-list">';
            const compNames = Component.NAME;
            for (let compName in compNames) {
                const compCls = yield Component.getClass(compNames[compName]);
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
        });
    }
    getWrapper() {
        return this._wrapper;
    }
    addComponent(componentName, options, nextTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const cls = yield Component.getClass(componentName);
            let component;
            if (cls) {
                const id = options ? options.id : null;
                component = new cls(id, options);
                yield component.init();
                const templateElement = component.getTemplateElement();
                if (nextTo) {
                    nextTo.insertAdjacentElement("afterend", templateElement);
                }
                else {
                    this.getWrapper().appendChild(templateElement);
                }
                if (component.isAvailable()) {
                    this._components[component.id] = component;
                }
            }
            return component;
        });
    }
    getComponent(compId) {
        return this._components[compId];
    }
    getComponentElement(compId) {
        const component = this.getComponent(compId);
        return component ? component.getElement() : null;
    }
    removeComponent(compId) {
        const component = this.getComponent(compId);
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
        }
        else {
            document.querySelectorAll(".comp.selected").forEach((selectedComp) => {
                let selectedCompId = selectedComp.id;
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
     * @param compId
     * @returns
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
            this.openStyleEditingModal(compId);
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
     * @param compId
     * @returns
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
     * @param compId
     * @param e
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
                boxElement.style.width = parseFloat(elementStyle.width) + (parseFloat(range.margin.left) + parseFloat(range.margin.right)) + "px";
                boxElement.style.height = value;
                if (position === "top") {
                    boxElement.style.top = "-" + value;
                }
                else {
                    boxElement.style.bottom = "-" + value;
                }
                boxElement.style.left = "-" + range.margin.left;
            }
            else if (position === "left" || position === "right") {
                boxElement.style.width = value;
                boxElement.style.height = elementStyle.height;
                if (position === "left") {
                    boxElement.style.left = "-" + value;
                }
                else {
                    boxElement.style.right = "-" + value;
                }
                boxElement.style.top = "0";
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
            }
            else if (position === "right" || position === "left") {
                boxElement.style.top = range.padding.top;
                boxElement.style.width = value;
                boxElement.style.height = parseFloat(elementStyle.height) - (parseFloat(range.padding.top) + parseFloat(range.padding.bottom)) + "px";
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
    /**
     *
     * @param compId
     * @param callback
     * @returns
     */
    openStyleEditingModal(compId, callback) {
        const comp = this.getComponent(compId);
        if (!comp) {
            return;
        }
        let modalTemplate = "";
        const styleItems = comp.getStyleItems();
        for (let styleItem of styleItems) {
            modalTemplate += styleItem.getTemplate();
        }
        openModal(modalTemplate, {
            title: "스타일 편집",
            confirmText: "적용"
        }, (modal) => __awaiter(this, void 0, void 0, function* () {
            let styleItemElems = modal.querySelectorAll(".style-attribute-list");
            for (let styleItemElem of styleItemElems) {
                const styleItemName = styleItemElem.dataset.name;
                const styleItem = comp.getStyleItem(styleItemName);
                if (styleItem) {
                    const styleAttrElems = styleItemElem.querySelectorAll(".style-attribute-item");
                    for (let styleAttrElem of styleAttrElems) {
                        const styleAttrName = styleAttrElem.dataset.name;
                        styleItem.setStyleAttribute(styleAttrName, ""); // TODO : 입력된 값을 가져오는 메서드 구현 필요
                    }
                }
            }
            yield comp.render();
        }));
    }
}
