import Component from "./Component.js";
import ComponentStyle from "./style/ComponentStyle.js";
class Column extends Component {
    constructor(id, options) {
        super(id, Column.PROPS);
        this._size = options ? (options.size || 1) : 1;
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
            ComponentStyle.NAME.BACKGROUND
        ]
    }
};
export default Column;
