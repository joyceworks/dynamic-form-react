export interface Swimlane {
    elements: Element[];
    span: number;
}

export interface Element {
    options?: any[];
    value?: any;
    id: string;
    type: string;
    swimlanes?: Swimlane[];
    label?: string;
    placeholder?: string;
    labeled?: boolean;
    warningable?: boolean;
    warning?: string;
    required?: boolean;
}
