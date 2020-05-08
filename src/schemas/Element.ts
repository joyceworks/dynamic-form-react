export interface Swimlane {
    elements: Element[];
}

export interface Element {
    value?: any;
    id: string;
    type: string;
    swimlanes?: Swimlane[];
    label?: string;
    placeholder?: string;
    labeled?: boolean;
    warningable?: boolean;
    layout?: 'inline' | 'default';
    warning?: string;
    required?: boolean;
}
