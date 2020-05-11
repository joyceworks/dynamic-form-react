import {CellData} from "./schemas/CellData";

export function locateById(rootCellData: CellData, cellDataId: string): [string | null, number] {
    let id: string | null = null;
    let swimlaneIndex: number = -1;
    let func = function (data: CellData): [string | null, number] {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const cellData of swimlane.cellDataList) {
                    if (cellData.id === cellDataId) {
                        id = data.id;
                        swimlaneIndex = data.swimlanes.indexOf(swimlane);
                        break;
                    }
                    if (cellData.type === 'grid') {
                        func(cellData);
                    }
                }
            }
        }
        return [id, swimlaneIndex];
    };
    return func(rootCellData);
}

export function get(rootCellData: CellData, parentId: string, swimlaneIndex: number): CellData[] | null {
    let list: CellData[] | null = null;
    let func = function (data: CellData) {
        if (data.id === parentId) {
            return data.swimlanes![swimlaneIndex].cellDataList;
        }
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const cellData of swimlane.cellDataList) {
                    if (cellData.type === 'grid') {
                        if (cellData.id === parentId) {
                            list = cellData.swimlanes![swimlaneIndex].cellDataList;
                        } else {
                            func(cellData);
                        }
                    }
                }
            }
        }
        return list;
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
                    for (const cellData of swimlane.cellDataList) {
                        if (cellData.type === 'grid') {
                            func(cellData);
                        }
                    }
                }
            }
        }
        return [id, swimlaneIndex];
    };
    return func(rootCellData);
}
