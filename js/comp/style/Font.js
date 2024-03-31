import ComponentStyle from "./ComponentStyle.js";
class Font extends ComponentStyle {
    constructor() {
        super(ComponentStyle.NAME.FONT, Font.PROPS);
    }
}
Font.PROPS = {
    displayName: {
        default: "글꼴",
        en: "Font"
    }
};
export default Font;
