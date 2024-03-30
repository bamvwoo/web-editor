export default class ComponentStyle {
    static NAME_FONT = "Font";
    static NAME_BACKGROUND = "Background";
    static NAME_BORDER = "Border";

    constructor(name, props) {
        if (this.constructor === ComponentStyle) {
            throw new Error("Cannot create an instance of abstract class");
        }

        this._name = name;
        this._displayName = props.displayName;
    }

    static async getClass(styleName) {
        try {
            const module = await import("./" + styleName + ".js");
            return module.default;
        } catch (e) {
            return null;
        }
    }

    static getComponentStyleNames() {
        const staticKeys = Object.keys(ComponentStyle).filter(key => key.startsWith("NAME_"));
        return staticKeys.map(key => ComponentStyle[key]);
    }
}