import {Element} from "../../schemas/Element";

export function getData(cell: Element) {
    let result = {};
    let func = function (data: Element, result: { [key: string]: any }) {
        if (data.swimlanes) {
            data.swimlanes.forEach(swimlane => {
                swimlane.elements.forEach(element => {
                    switch (element.type) {
                        case 'grid':
                            func(element, result);
                            break;
                        case 'list':
                            result[element.id] = [];
                            // @ts-ignore
                            element.swimlanes.forEach((row, index) => {
                                if (index > 0) {
                                    let rowResult: { [key: string]: any } = {};
                                    row.elements.forEach(listElement => {
                                        rowResult[listElement.id] = listElement.value;
                                    });
                                    result[element.id].push(rowResult);
                                }
                            });
                            break;
                        default:
                            result[element.id] = element.value;
                            break;
                    }
                });
            });
        }
    };
    func(cell, result);
    return result;
}

export function setValue(cell: Element, target: Element, value: any) {
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
                                    if (listElement === target) {
                                        listElement.value = value;
                                        return true;
                                    }
                                }
                            }
                            break;
                        default:
                            if (element === target) {
                                element.value = value;
                                return true;
                            }
                            break;
                    }
                }
            }
        }
        return false;
    };
    return func(cell);
}
