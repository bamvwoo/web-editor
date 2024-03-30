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
                type: "size"
            },
            {
                name: "color",
                displayName: {
                    default: "테두리 색상",
                    en: "Border Color"
                },
                type: "color"
            },
            {
                name: "style",
                displayName: {
                    default: "테두리 스타일",
                    en: "Border Style"
                },
                type: "select",
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
        super(ComponentStyle.NAME_BORDER, Border.PROPS);
    }
}