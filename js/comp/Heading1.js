import Component from "./Component.js";

export default class Heading1 extends Component {
    static NAME = "Heading1";

    constructor(id) {
        const props = {
            name: Heading1.NAME,
            className: "comp-heading"
        }

        super(id, props);

        this._content = "";
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
        this.render();
    }

    get template() {
        return `<h1>${this._content}</h1>`;
    }
}