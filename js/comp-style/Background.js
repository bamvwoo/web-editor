import ComponentStyle from "./ComponentStyle.js";

export default class Background extends ComponentStyle {
    static PROPS = {
        displayName: {
            default: "배경",
            en: "Background"
        },
        attributes : [
            {
                name: "color",
                displayName: {
                    default: "배경색",
                    en: "Background Color"
                },
                type: "color"
            },
            {
                name: "image",
                displayName: {
                    default: "배경이미지",
                    en: "Background Image"
                },
                type: "image"
            }
        ]
    };

    constructor() {
        super(ComponentStyle.NAME_BACKGROUND, Background.PROPS);
    }
}