import Component from "./Component.js";
import ComponentStyle from "../comp-style/ComponentStyle.js";

export default class Column extends Component {
    static PROPS = {
        name: Component.NAME_COLUMN,
        displayName: {
            default: "다단 컬럼",
            en: "Column"
        },
        className: "comp-column",
        thumbnail: "/assets/images/thumbnail/column.png",
        style: {
            "selector": null,
            "items": [
                ComponentStyle.NAME_BACKGROUND
            ]
        }
    };

    constructor(id, options) {
        super(id, Column.PROPS);

        this._size = options ? (options.size || 1) : 1;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
    }
}