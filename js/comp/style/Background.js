import ComponentStyle from "./ComponentStyle.js";
class Background extends ComponentStyle {
    constructor() {
        super(ComponentStyle.NAME.BACKGROUND, Background.PROPS);
    }
}
Background.PROPS = {
    displayName: {
        default: "배경",
        en: "Background"
    },
    attributes: [
        {
            name: "color",
            displayName: {
                default: "배경색",
                en: "Background Color"
            },
            type: ComponentStyle.ATTRIBUTE_TYPE.COLOR
        },
        {
            name: "image",
            displayName: {
                default: "배경이미지",
                en: "Background Image"
            },
            type: ComponentStyle.ATTRIBUTE_TYPE.IMAGE
        }
    ]
};
export default Background;
