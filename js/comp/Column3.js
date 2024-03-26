import Component from "./Component.js";

export default class Column3 extends Component {
    static NAME = "Column3";
    static PROPS = {
        name: Column3.NAME,
        displayName: "3단 컬럼",
        className: "comp-column",
        thumbnail: "/assets/images/thumbnail/column3.png"
    };

    constructor(id) {
        super(id, Column3.PROPS);

        this._content = "";
    }

    get template() {
        return `
            <div></div>
            <div></div>
            <div></div>
        `;
    }
}