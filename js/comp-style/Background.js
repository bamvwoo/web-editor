import ComponentStyle from "./ComponentStyle.js";
import ComponentStyleAttribute from "./ComponentStyleAttribute.js";
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
        new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.COLOR, {
            name: "color",
            displayName: {
                default: "배경색",
                en: "Background Color"
            }
        }),
        new ComponentStyleAttribute(ComponentStyleAttribute.TYPE.IMAGE, {
            name: "image",
            displayName: {
                default: "배경이미지",
                en: "Background Image"
            }
        })
    ]
};
export default Background;
