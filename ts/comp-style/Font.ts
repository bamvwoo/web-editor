import ComponentStyle from "./ComponentStyle.js";
import ComponentStyleAttribute from "./ComponentStyleAttribute.js";

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
            }),
            new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.SIZE, {
                name: "weight",
                displayName: {
                    default: "글꼴 굵기",
                    en: "Font Weight"
                }
            })
        ]
    };

    constructor() {
        super(ComponentStyle.NAME.FONT, Font.PROPS);
    }
}