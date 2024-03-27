import Component from "./Component.js";

export default class Heading extends Component {
    static NAME = "Heading";
    static PROPS = {
        name: Heading.NAME,
        displayName: "머릿말",
        className: "comp-heading",
        thumbnail: "/assets/images/thumbnail/heading.png"
    };

    constructor(id, options) {
        super(id, Heading.PROPS);

        this._content = options ? (options.content || "") : "";
        this._size = options ? (options.size || 1) : 1;
    }

    setContent(content, autoRender) {
        autoRender = autoRender === undefined ? true : autoRender;

        this._content = content;

        if (autoRender) {
            this.render();
        }
    }

    setStyle(any, value) {
        const targetElement = this.getElement().querySelector("h" + this._size);
        super.setStyle(targetElement, any, value);
    }

    get template() {
        return `<h${this._size}>${this._content}</h${this._size}>`;
    }
}