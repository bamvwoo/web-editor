import Component from "./Component.js";
import ComponentStyle from "../comp-style/ComponentStyle.js";
class Column extends Component {
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
    getTemplate() {
        let template = "";
        for (let i = 0; i < this._size; i++) {
            template += `<div></div>`;
        }
        ;
        return template;
    }
}
Column.PROPS = {
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
export default Column;
