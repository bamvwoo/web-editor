import Component from "./Component.js";

export default class Heading1 extends Component {
    static NAME = "Heading1";
    static PROPS = {
        name: Heading1.NAME,
        displayName: "Heading 1",
        className: "comp-heading",
        thumbnail: "/assets/images/thumbnail/heading1.png"
    };

    constructor(id) {
        super(id, Heading1.PROPS);

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