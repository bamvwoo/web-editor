import Component from "./Component.js";
import ComponentStyle from "../comp-style/ComponentStyle.js";

export default class Heading extends Component {
    static PROPS = {
        name: Component.NAME_HEADING,
        displayName: {
            default: "머릿말",
            en: "Heading"
        },
        className: "comp-heading",
        thumbnail: "/assets/images/thumbnail/heading.png",
        style: {
            "selector": null,
            "items": [
                ComponentStyle.NAME_FONT,
                ComponentStyle.NAME_BACKGROUND
            ]
        }
    };

    constructor(id, options) {
        super(id, Heading.PROPS);

        this._content = options ? (options.content || Heading.PROPS.displayName.default) : Heading.PROPS.displayName.default;
        this._size = options ? (options.size || 1) : 1;

        this.setStyleSelector("& > h" + this._size);
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
    }

    async setContent(content) {
        this._content = content;
        await this.render();
    }
}