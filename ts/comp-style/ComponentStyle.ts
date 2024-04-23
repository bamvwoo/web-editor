import { DisplayName, Localizable, Renderable } from "../common/interfaces.js";
import ComponentStyleAttribute from "./ComponentStyleAttribute.js";

enum Name {
    FONT = "font",
    BACKGROUND = "background",
    BORDER = "border"
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
        let template = `<ul class="style-attribute-list" data-name="${this._name}">`;
        for (let attribute of this._attributes) {
            const attributeId = 
            template += `
                <li class="style-attribute-item" data-name="${this._name.toLowerCase()}-${attribute.name}">
                    <label>${attribute.getDisplayName()}</label>
                    ${attribute.getTemplate()}
                </li>
            `;
        }
        template += "</ul>";

        return template;
    }

    getStyleAttributes(): ComponentStyleAttribute[] {
        return this._attributes;
    }

    getStyleAttribute(name: string): ComponentStyleAttribute {
        return this._attributes.find(attribute => attribute.name === name);
    }

    setStyleAttribute(name: string, value: string): void {
        const attribute = this.getStyleAttribute(name);
        if (attribute) {
            attribute.value = value;
        }
    }
}