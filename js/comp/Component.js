import { createUniqueId } from "../utils.js";

export default class Component {
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

    /* Abstract Methods */

    get template() {
        throw new Error("You have to implement the template getter method");
    }

    #getRange() {
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

    #showRange(e) {
        const element = this.getElement();
        const elementStyle = getComputedStyle(element);
        
        const range = this.#getRange();

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

    #hideComponentRange(e) {
        const element = this.getElement();
        element.querySelectorAll(".comp > .range-box").forEach((box) => {
            box.remove();
        });
    }

    /**
     * 
     * @param {*} editor 
     * @param {*} nextTo 
     */
    init(editor, nextTo) {
        // 태그 생성
        const element = document.createElement("div");
        element.id = this._id;

        element.classList.add("comp");
        element.classList.add(this._className);

        // 탬플릿 삽입
        element.innerHTML = this.template;

        // 에디터에 컴포넌트의 요소 추가
        if (nextTo) {
            nextTo.insertAdjacentElement("afterend", element);
        } else {
            editor.getWrapper().appendChild(element);
        }

        this.render();

        this.#initHandler.bind(this)();
    }

    render() {
        this.getElement().innerHTML = this.template;
    }

    #initHandler() {
        const element = this.getElement();

        element.addEventListener("mouseover", (e) => {
            this.#showRange.bind(this, e);
        });
        element.addEventListener("mouseout", (e) => {
            this.#hideComponentRange.bind(this, e);
        });
        element.addEventListener("click", this.select.bind(this));
    }

    #isSelected() {
        return this.getElement().classList.contains("selected");
    }

    getElement() {
        return document.getElementById(this._id);
    }

    isAvailable() {
        return this._id !== null && this.getElement() !== null;
    }

    select() {
        const element = this.getElement();

        if (this.#isSelected()) {
            element.classList.remove("selected");
        } else {
            document.querySelectorAll(".comp.selected").forEach((comp) => {
                comp.classList.remove("selected");
            });

            const elementStyle = getComputedStyle(element);
    
            element.classList.add("selected");
        }
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
}