import Component from "./Component.js";

export default class Column2 extends Component {
    static NAME = "Column2";
    static PROPS = {
        name: Column2.NAME,
        displayName: "2단 컬럼",
        className: "comp-column",
        thumbnail: "/assets/images/thumbnail/column2.png"
    };

    constructor(id) {
        super(id, Column2.PROPS);

        this._content = "";
    }

    get template() {
        return `
            <div></div>
            <div></div>
        `;
    }
}