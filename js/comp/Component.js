import { createUniqueId } from "../utils.js";

export default class Component {
    #width;
    #height;
    #margin;
    #padding;

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

    get template() {
        throw new Error("You have to implement the template getter method");
    }

    #setRange() {
        const element = this.getElement();

        this.#margin = {
            top: getComputedStyle(element).marginTop,
            right: getComputedStyle(element).marginRight,
            bottom: getComputedStyle(element).marginBottom,
            left: getComputedStyle(element).marginLeft
        };
    
        this.#padding = {
            top: getComputedStyle(element).paddingTop,
            right: getComputedStyle(element).paddingRight,
            bottom: getComputedStyle(element).paddingBottom,
            left: getComputedStyle(element).paddingLeft
        };

        this.#width = getComputedStyle(element).width;
        this.#height = getComputedStyle(element).height;
    }

    #showComponentRange(e) {
        const element = this.getElement();

        element.style.padding = 0;
        element.style.margin = 0;

        const marginBox = document.createElement("div");
        marginBox.classList.add("margin-box");
    
        marginBox.style.paddingTop = this.#margin.top;
        marginBox.style.paddingRight = this.#margin.right;
        marginBox.style.paddingBottom = this.#margin.bottom;
        marginBox.style.paddingLeft = this.#margin.left;

        marginBox.style.width = (parseFloat(this.#width) + parseFloat(this.#margin.left) + parseFloat(this.#margin.right)) + "px";
        marginBox.style.height = (parseFloat(this.#height) + parseFloat(this.#margin.top) + parseFloat(this.#margin.bottom)) + "px";

        const paddingBox = document.createElement("div");
        paddingBox.classList.add("padding-box");
    
        paddingBox.style.paddingTop = this.#padding.top;
        paddingBox.style.paddingRight = this.#padding.right;
        paddingBox.style.paddingBottom = this.#padding.bottom;
        paddingBox.style.paddingLeft = this.#padding.left;
        
        const cloneNode = element.cloneNode(true);
        paddingBox.appendChild(cloneNode);
        marginBox.appendChild(paddingBox);

        element.parentNode.replaceChild(marginBox, element);

        marginBox.addEventListener("mouseout", this.#hideComponentRange.bind(this));
        this.#initHandler.bind(this)();
    }

    #hideComponentRange(e) {
        this.getElement().style.margin = Object.values(this.#margin).join(" ");
        this.getElement().style.padding = Object.values(this.#padding).join(" ");

        const paddingBox = this.getElement().parentNode;
        const marginBox = paddingBox.parentNode;

        marginBox.parentNode.replaceChild(this.getElement(), marginBox);

        paddingBox.remove();
        marginBox.remove();

        this.getElement().addEventListener("mouseover", this.#showComponentRange.bind(this));
        this.#initHandler.bind(this)();
    }

    init(editor) {
        // 태그 생성 후 탬플릿 삽입
        const element = document.createElement("div");
        element.id = this._id;
        element.classList.add("comp");
        element.classList.add(this._className);
        element.innerHTML = this.template;

        // 에디터에 컴포넌트의 요소 추가
        editor.getWrapper().appendChild(element);

        this.render();

        this.#setRange.bind(this)();

        this.getElement().addEventListener("mouseover", this.#showComponentRange.bind(this));
        this.#initHandler.bind(this)();
    }

    render() {
        this.getElement().innerHTML = this.template;
    }

    #initHandler() {
        this.getElement().addEventListener("click", this.select.bind(this));
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
        if (this.#isSelected()) {
            this.getElement().classList.remove("selected");
        } else {
            document.querySelectorAll(".comp.selected").forEach((comp) => {
                comp.classList.remove("selected");
            });
    
            this.getElement().classList.add("selected");
        }
    }
}