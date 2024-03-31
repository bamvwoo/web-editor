import { DisplayName, Localizable } from "../../common/interfaces.js";

enum Name {
    FONT = "Font",
    BACKGROUND = "Background",
    BORDER = "Border"
};

type Props = {
    displayName: DisplayName,
    attributes?: Attribute[]
};

interface Attribute {
    name: string,
    displayName: DisplayName,
    type: AttributeType,
    values?: string[]
};

enum AttributeType {
    COLOR = "color",
    IMAGE = "image",
    SIZE = "size",
    SELECT = "select"
};

export default abstract class ComponentStyle implements Localizable {
    static readonly PROPS = {};
    static readonly NAME = Name;
    static readonly ATTRIBUTE_TYPE = AttributeType;

    private _name: Name;
    private _displayName: DisplayName;
    private _attributes: Attribute[];

    constructor(name: Name, props: Props) {
        this._name = name;
        this._displayName = props.displayName;
        this._attributes = props.attributes ? props.attributes : [];
    }

    static async newInstance<T extends ComponentStyle>(styleName: Name | string): Promise<T> {
        try {
            const module = await import("./" + styleName + ".js");
            return module.default();
        } catch (e) {
            return null;
        }
    }

    getDisplayName(locale?: string): string {
        return this._displayName[locale || "default"];
    }
}