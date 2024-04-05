import { createUniqueId } from "../common/utils.js";
import ComponentStyle from "../comp-style/ComponentStyle.js";
import { DisplayName, Localizable, Renderable } from "../common/interfaces.js";

enum Name {
    HEADING = "Heading",
    COLUMN = "Column"
};

type Props = {
    name: Name,
    displayName: DisplayName,
    className: string,
    thumbnail: string,
    style?: Style
};

type Style = {
    selector?: string,
    itemNames?: string[],
    items?: ComponentStyle[]
};

type Range = {
    margin: {
        top: string,
        right: string,
        bottom: string,
        left: string
    },
    padding: {
        top: string,
        right: string,
        bottom: string,
        left: string
    }
};

export default abstract class Component implements Localizable, Renderable {
    static readonly NAME = Name;

    private _id: string;
    private _name: Name;
    private _displayName: DisplayName;
    private _className: string;
    private _thumbnail: string;
    private _style: Style;

    private _templateElem: HTMLElement;

    constructor(id: string, props: Props) {
        this._id = id || createUniqueId();
        this._name = props.name;
        this._displayName = props.displayName;
        this._className = props.className;
        this._thumbnail = props.thumbnail;
        this._style = props.style ? { ...props.style } : {};
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    getRange(): Range {
        const element: HTMLElement = this.getElement();
        const elementStyle: CSSStyleDeclaration = getComputedStyle(element);

        return {
            margin: {
                top: elementStyle.marginTop,
                right: elementStyle.marginRight,
                bottom: elementStyle.marginBottom,
                left: elementStyle.marginLeft
            },

            padding: {
                top: elementStyle.paddingTop,
                right: elementStyle.paddingRight,
                bottom: elementStyle.paddingBottom,
                left: elementStyle.paddingLeft
            }
        }
    }

    async init(): Promise<void> {
        // 태그 생성
        this._templateElem = document.createElement("div");
        this._templateElem.id = this._id;

        this._templateElem.classList.add("comp");
        this._templateElem.classList.add(this._className);

        // 탬플릿 삽입
        const template: string = await this.getTemplate();
        this._templateElem.innerHTML = template;

        // 스타일 초기화
        await this.#initStyle.bind(this)();        
    }

    async #initStyle(): Promise<void> {
        const styleItemNames: string[] = this._style.itemNames;
        if (styleItemNames) {
            let styleInstances: ComponentStyle[] = [];
            for (const styleName of styleItemNames) {
                styleInstances.push(await ComponentStyle.newInstance(styleName));
            }
            
            this._style.items = styleInstances as ComponentStyle[];
        }
    }

    async render(): Promise<void> {
        if (!this.isAvailable()) {
            throw new Error("Component is not available");
        }

        // TODO : 스타일 적용

        const element: HTMLElement = this.getElement();
        element.innerHTML = await this.getTemplate();
    }

    isSelected(): boolean {
        const element: HTMLElement = this.getElement();
        return element.classList.contains("selected");
    }

    getElement(): HTMLElement {
        return document.getElementById(this._id);
    }

    isAvailable(): boolean {
        return this._id !== null && this.getElement() !== null;
    }

    getTemplateElement(): HTMLElement {
        return this._templateElem;
    }

    getStyleSelector(): string {
        if (!this._style) {
            return this._style.selector;
        }
    }

    setStyleSelector(selector: string): void {
        if (!this._style) {
            this._style.selector = selector;
        }
    }

    static async getClass(componentName: Name | string): Promise<typeof Component> {
        try {
            const module = await import("./" + componentName + ".js");
            return module.default;
        } catch (e) {
            return null;
        }
    }

    abstract getTemplate(): string;

    getDisplayName(locale?: string): string {
        return this._displayName[locale || "default"];
    }

    getStyleItems(): ComponentStyle[] {
        return this._style.items;
    }

    getStyleItem(name: string): ComponentStyle {
        return this._style.items.find(item => item.name === name);
    }
}