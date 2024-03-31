import ComponentStyle from "./ComponentStyle.js";

export default class Border extends ComponentStyle {
    static PROPS = {
        displayName: {
            default: "테두리",
            en: "Border"
        },
        attributes: [
            {
                name: "width",
                displayName: {
                    default: "테두리 두께",
                    en: "Border Width"
                },
                type: ComponentStyle.ATTRIBUTE_TYPE.SIZE
            },
            {
                name: "color",
                displayName: {
                    default: "테두리 색상",
                    en: "Border Color"
                },
                type: ComponentStyle.ATTRIBUTE_TYPE.COLOR
            },
            {
                name: "style",
                displayName: {
                    default: "테두리 스타일",
                    en: "Border Style"
                },
                type: ComponentStyle.ATTRIBUTE_TYPE.SELECT,
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
            }
        ]
    };

    constructor() {
        super(ComponentStyle.NAME.BORDER, Border.PROPS);
    }
}