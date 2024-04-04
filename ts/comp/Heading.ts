import Component from "./Component.js";
import ComponentStyle from "./style/ComponentStyle.js";

type Options = {
    size: number
    content?: string,
}

export default class Heading extends Component {
    static PROPS = {
        name: Component.NAME.HEADING,
        displayName: {
            default: "머릿말",
            en: "Heading"
        },
        className: "comp-heading",
        thumbnail: "/assets/images/thumbnail/heading.png",
        style: {
            "selector": null,
            "itemNames": [
                ComponentStyle.NAME.FONT,
                ComponentStyle.NAME.BACKGROUND
            ]
        }
    };

    private _size: number;
    private _content: string;

    constructor(id: string, options: Options) {
        super(id, Heading.PROPS);

        this._size = options ? (options.size || 1) : 1;
        this._content = options ? (options.content || Heading.PROPS.displayName.default) : Heading.PROPS.displayName.default;

        this.setStyleSelector("& > h" + this._size);
    }

    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._size = size;
        this.setStyleSelector("& > h" + this._size);
    }

    get content(): string {
        return this._content;
    }

    async setContent(content: string) {
        this._content = content;
        await this.render();
    }

    getTemplate(): string {
        return `
            <h${this._size}>${this._content}</h${this._size}>
        `;
    }
}