class Component {
    #margin;
    #padding;

    constructor(id, props) {
        if (this.constructor === Component) {
            throw new Error("Cannot create an instance of abstract class");
        }

        this._id = id || createUniqueId();
        this._name = props.name;
        this._className = props.className;
        this._template = props.template;
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
        return this._template;
    }

    set template(template) {
        this._template = template;
    }

    #setRange() {
        this.#margin = {
            top: getComputedStyle(this.getElement()).marginTop,
            right: getComputedStyle(this.getElement()).marginRight,
            bottom: getComputedStyle(this.getElement()).marginBottom,
            left: getComputedStyle(this.getElement()).marginLeft,
        };
    
        this.#padding = {
            top: getComputedStyle(this.getElement()).paddingTop,
            right: getComputedStyle(this.getElement()).paddingRight,
            bottom: getComputedStyle(this.getElement()).paddingBottom,
            left: getComputedStyle(this.getElement()).paddingLeft
        };
    }

    #showComponentRange(e) {
        this.getElement().style.padding = 0;
        this.getElement().style.margin = 0;
    
        const marginBox = document.createElement("div");
        marginBox.classList.add("margin-box");
    
        marginBox.style.paddingTop = this.#margin.top;
        marginBox.style.paddingRight = this.#margin.right;
        marginBox.style.paddingBottom = this.#margin.bottom;
        marginBox.style.paddingLeft = this.#margin.left;
        
        const paddingBox = document.createElement("div");
        paddingBox.classList.add("padding-box");
    
        paddingBox.style.paddingTop = this.#padding.top;
        paddingBox.style.paddingRight = this.#padding.right;
        paddingBox.style.paddingBottom = this.#padding.bottom;
        paddingBox.style.paddingLeft = this.#padding.left;
    
        const cloneNode = this.getElement().cloneNode(true);
        paddingBox.appendChild(cloneNode);
        marginBox.appendChild(paddingBox);
    
        this.getElement().parentNode.replaceChild(marginBox, this.getElement());

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

        this.#setRange.bind(this)();

        this.getElement().addEventListener("mouseover", this.#showComponentRange.bind(this));
        this.#initHandler.bind(this)();
    }

    #initHandler() {
        this.getElement().addEventListener("click", this.#selectComponent.bind(this));
    }

    getElement() {
        return document.getElementById(this._id);
    }

    isAvailable() {
        return this._id !== null && this.getElement() !== null;
    }

    #isSelected() {
        return this.getElement().classList.contains("selected");
    }

    #selectComponent() {
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