import ComponentStyle from "./ComponentStyle.js";
import ComponentStyleAttribute from "./ComponentStyleAttribute.js";

export default class Border extends ComponentStyle {
    static PROPS = {
        displayName: {
            default: "테두리",
            en: "Border"
        },
        attributes: [
            new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.SIZE, {
                name: "width",
                displayName: {
                    default: "테두리 두께",
                    en: "Border Width"
                },
                units: ComponentStyleAttribute.UNIT.PIXEL
            }),
            new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.COLOR, {
                name: "color",
                displayName: {
                    default: "테두리 색상",
                    en: "Border Color"
                }
            }),
            new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.SELECT, {
                name: "style",
                displayName: {
                    default: "테두리 스타일",
                    en: "Border Style"
                },
                values: [
                    "none",
                    "solid",
                    "dashed",
                    "dotted",
                    "double",
                    "groove",
                    "ridge",
                    "inset",
                    "outset"
                ]
            })
        ]
    };

    constructor() {
        super(ComponentStyle.NAME.BORDER, Border.PROPS);
    }
}