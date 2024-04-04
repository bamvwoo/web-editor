import Component from "./Component.js";
import ComponentStyle from "./style/ComponentStyle.js";

type Options = {
    size: number
};

export default class Column extends Component {
    static PROPS = {
        name: Component.NAME.COLUMN,
        displayName: {
            default: "다단 컬럼",
            en: "Column"
        },
        className: "comp-column",
        thumbnail: "/assets/images/thumbnail/column.png",
        style: {
            "selector": null,
            "itemNames": [
                ComponentStyle.NAME.BACKGROUND,
                ComponentStyle.NAME.BORDER
            ]
        }
    };

    private _size: number;

    constructor(id: string, options) {
        super(id, Column.PROPS);

        this._size = options ? (options.size || 1) : 1;
    }

    get size(): number {
        return this._size;
    }

    set size(size: number) {
        this._size = size;
    }

    getTemplate(): string {
        let template = "";
        for (let i = 0; i < this._size; i++) {
            template += `<div></div>`;
        };

        return template;
    }
}