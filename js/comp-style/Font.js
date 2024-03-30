import ComponentStyle from "./ComponentStyle.js";

export default class Font extends ComponentStyle {
    static PROPS = {
        displayName: {
            default: "글꼴",
            en: "Font"
        }
    };

    constructor() {
        super(ComponentStyle.NAME_FONT, Font.PROPS);
    }
}