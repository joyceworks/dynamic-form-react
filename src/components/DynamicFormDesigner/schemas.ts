export class Widget {
    type: string;
    icon: any;
    name: string;
    enable: boolean;

    constructor(type: string, icon: any, name: string, enable: boolean) {
        this.type = type;
        this.icon = icon;
        this.name = name;
        this.enable = enable;
    }
}