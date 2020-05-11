import {CellData} from "./schemas/CellData";

export function locate(rootCellData: CellData, cellDataId: string): [string | null, number] {
    let id: string | null = null;
    let swimlaneIndex: number = -1;
    let func = function (data: CellData): [string | null, number] {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const element of swimlane.cellDataList) {
                    if (element.id === cellDataId) {
                        id = data.id;
                        swimlaneIndex = data.swimlanes.indexOf(swimlane);
                        break;
                    }
                    if (element.type === 'grid') {
                        func(element);
                    }
                }
            }
        }
        return [id, swimlaneIndex];
    };
    return func(rootCellData);
}

export function findCellDataList(rootCellData: CellData, cellId: string, swimlaneIndex: number): CellData[] | null {
    let cells: CellData[] | null = null;
    let func = function (data: CellData) {
        if (data.id === cellId) {
            return data.swimlanes![swimlaneIndex].cellDataList;
        }
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const cell of swimlane.cellDataList) {
                    if (cell.type === 'grid') {
                        if (cell.id === cellId) {
                            cells = cell.swimlanes![swimlaneIndex].cellDataList;
                        } else {
                            func(cell);
                        }
                    }
                }
            }
        }
        return cells;
    };
    return func(rootCellData);
}

export function locateByRef(rootCellData: CellData, cellDataList: CellData[]) {
    let id: string | null = null;
    let swimlaneIndex: number = -1;
    let func = function (data: CellData): [string | null, number] {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                if (swimlane.cellDataList === cellDataList) {
                    id = data.id;
                    swimlaneIndex = data.swimlanes.indexOf(swimlane);
                    break;
                } else {
                    for (const element of swimlane.cellDataList) {
                        if (element.type === 'grid') {
                            func(element);
                        }
                    }
                }
            }
        }
        return [id, swimlaneIndex];
    };
    return func(rootCellData);
}

export function createWidgetInstance(widgetType: string) {
    let element: CellData = {type: widgetType, id: widgetType + new Date().getTime()};
    if (element.type === 'grid') {
        element.swimlanes = [{span: 50, cellDataList: []}, {span: 50, cellDataList: []}];
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
        element.swimlanes = [{cellDataList: [], span: 100}];
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
