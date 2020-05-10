import {Element} from "../../schemas/Element";

export function findListOfIndicatorInside(rootElement: Element): Element[] | null {
    let elements: Element[] | null = null;
    let func = function (data: Element) {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const element of swimlane.elements) {
                    switch (element.type) {
                        case 'grid':
                            func(element);
                            break;
                        case 'list':
                            // @ts-ignore
                            for (const row of element.swimlanes) {
                                for (let i = 0; i < row.elements.length; i++) {
                                    let listElement = row.elements[i];
                                    if (listElement.type === 'indicator') {
                                        elements = row.elements;
                                    }
                                }
                            }
                            break;
                        default:
                            if (element.type === 'indicator') {
                                elements = swimlane.elements;
                            }
                            break;
                    }
                }
            }
        }
        return elements;
    };
    return func(rootElement);
}

export function createWidgetInstance(widgetType: string) {
    let element: Element = {type: widgetType, id: widgetType + new Date().getTime()};
    if (element.type === 'grid') {
        element.swimlanes = [{span: 50, elements: []}, {span: 50, elements: []}];
    } else if (element.type === 'input') {
        element.label = '单行文本';
        element.placeholder = '请填写';
        element.required = false;
    } else if (element.type === 'textarea') {
        element.label = '多行文本';
        element.placeholder = '请填写';
        element.required = false;
    } else if (element.type === 'dropdown') {
        element.label = '下拉选择';
        element.placeholder = '请选择';
        element.options = [];
        element.required = false;
    } else if (element.type === 'list') {
        element.label = '列表';
        element.swimlanes = [{elements: [], span: 100}];
    } else if (element.type === 'datetime') {
        element.label = '日期时间';
        element.placeholder = '请选择';
        element.required = false;
    } else if (element.type === 'checkbox') {
        element.label = '多选';
        element.options = [];
        element.required = false;
    } else if (element.type === 'radio') {
        element.label = '单选';
        element.options = [];
        element.required = false;
    }
    return element;
}
