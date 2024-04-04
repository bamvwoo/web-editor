import { DisplayName, Localizable, Renderable } from "../../common/interfaces.js";
import ComponentStyleAttribute from "./attribute/ComponentStyleAttribute.js";

enum Name {
    FONT = "Font",
    BACKGROUND = "Background",
    BORDER = "Border"
};

type Props = {
    displayName: DisplayName,
    attributes?: ComponentStyleAttribute[]
};

export default abstract class ComponentStyle implements Localizable, Renderable {
    static readonly PROPS = {};
    static readonly NAME = Name;

    private _name: Name;
    private _displayName: DisplayName;
    private _attributes: ComponentStyleAttribute[];

    constructor(name: Name, props: Props) {
        this._name = name;
        this._displayName = props.displayName;
        this._attributes = props.attributes ? props.attributes : [];
    }

    get name(): Name {
        return this._name;
    }

    get attributes(): ComponentStyleAttribute[] {
        return this._attributes;
    }

    static async newInstance<T extends ComponentStyle>(styleName: Name | string): Promise<T> {
        try {
            const module = await import("./" + styleName + ".js");
            return new module.default();
        } catch (e) {
            return null;
        }
    }

    getDisplayName(locale?: string): string {
        return this._displayName[locale || "default"];
    }

    getTemplate(): string {
        let template = "";
        for (let attribute of this._attributes) {
            template += `
                <div class="attribute">
                    <label>${attribute.getDisplayName()}</label>
                    ${attribute.getTemplate()}
                </div>
            `;
        }

        return template;
    }
}