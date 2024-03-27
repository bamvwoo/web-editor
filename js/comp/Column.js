import Component from "./Component.js";

export default class Column extends Component {
    static NAME = "Column";
    static PROPS = {
        name: Column.NAME,
        displayName: "다단 컬럼",
        className: "comp-column",
        thumbnail: "/assets/images/thumbnail/column.png"
    };

    constructor(id, options) {
        super(id, Column.PROPS);

        this._size = options ? (options.size || 1) : 1;
    }

    get template() {
        let template = "";

        for (let i = 0; i < this._size; i++) {
            template += `<div></div>`;
        };

        return template
    }
}