import {CellData} from "./schemas/CellData";
import SwimlaneLocation from "./schemas/SwimlaneLocation";

export function locateById(rootCellData: CellData, cellDataId: string): SwimlaneLocation | null {
    let location: SwimlaneLocation | null = null;
    let func = function (data: CellData): SwimlaneLocation | null {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                for (const cellData of swimlane.cellDataList) {
                    if (cellData.id === cellDataId) {
                        location = {
                            cellId: data.id,
                            swimlaneIndex: data.swimlanes?.indexOf(swimlane)
                        }
                        break;
                    }
                    if (cellData.type === 'grid') {
                        func(cellData);
                    }
                }
            }
        }
        return location;
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

export function locateByCellDataListRef(rootCellData: CellData, cellDataList: CellData[]): SwimlaneLocation | null {
    let location: SwimlaneLocation | null = null;
    let func = function (data: CellData): SwimlaneLocation | null {
        if (data.swimlanes) {
            for (const swimlane of data.swimlanes) {
                if (swimlane.cellDataList === cellDataList) {
                    location = {
                        cellId: data.id,
                        swimlaneIndex: data.swimlanes.indexOf(swimlane),
                    }
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
        return location;
    };
    return func(rootCellData);
}
