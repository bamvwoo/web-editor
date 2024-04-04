export interface DisplayName {
    default: string,
    en?: string,
    ko?: string
};

export interface Localizable {
    getDisplayName(locale?: string): string;
};

export interface Renderable {
    getTemplate(): string;
};