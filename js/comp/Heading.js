var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Component from "./Component.js";
import ComponentStyle from "./style/ComponentStyle.js";
class Heading extends Component {
    constructor(id, options) {
        super(id, Heading.PROPS);
        this._size = options ? (options.size || 1) : 1;
        this._content = options ? (options.content || Heading.PROPS.displayName.default) : Heading.PROPS.displayName.default;
        this.setStyleSelector("& > h" + this._size);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size = size;
        this.setStyleSelector("& > h" + this._size);
    }
    get content() {
        return this._content;
    }
    setContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            this._content = content;
            yield this.render();
        });
    }
    getTemplate() {
        return `
            <h${this._size}>${this._content}</h${this._size}>
        `;
    }
}
Heading.PROPS = {
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
export default Heading;
