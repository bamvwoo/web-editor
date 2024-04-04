import ComponentStyle from "./ComponentStyle.js";
import ComponentStyleAttribute from "./attribute/ComponentStyleAttribute.js";

export default class Font extends ComponentStyle {
    static PROPS = {
        displayName: {
            default: "글꼴",
            en: "Font"
        },
        attributes: [
            new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.SIZE, {
                name: "size",
                displayName: {
                    default: "글꼴 크기",
                    en: "Font Size"
                },
                units: [ComponentStyleAttribute.UNIT.PIXEL, ComponentStyleAttribute.UNIT.REM, ComponentStyleAttribute.UNIT.EM]
            })
        ]
    };

    constructor() {
        super(ComponentStyle.NAME.FONT, Font.PROPS);
    }
}