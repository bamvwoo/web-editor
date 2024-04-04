import ComponentStyle from "./ComponentStyle.js";
import ComponentStyleAttribute from "./attribute/ComponentStyleAttribute.js";
class Font extends ComponentStyle {
    constructor() {
        super(ComponentStyle.NAME.FONT, Font.PROPS);
    }
}
Font.PROPS = {
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
export default Font;
