export default interface Element {
    value: any;
    label: string;
    placeholder: string;
    labeled: boolean;
    warningable: boolean;
    layout?: 'inline' | 'default';
    warning?: string;
    required: boolean;
}