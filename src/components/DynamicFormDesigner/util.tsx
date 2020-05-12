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

export function copyAndSplice(originData: CellData, id: string): [CellData, CellData[], CellData] {
    const location = locateById(originData, id)!;
    const copy = JSON.parse(JSON.stringify(originData));
    const src = get(copy, location.cellId, location.swimlaneIndex)!;
    const cell = src.find(cell => cell.id === id)!;
    src.splice(src.indexOf(cell), 1);
    return [copy, src, cell];
}

export function reducer(state: any, action: any) {
    if (action.type === 'MOVE') {
        const [copy, src, cell] = copyAndSplice(state, action.id);
        src.splice(action.hoverIndex, 0, cell);
        return copy;
    } else if (action.type === 'ADD') {
        const location = locateByCellDataListRef(state, action.cellDataList)!;
        const copy = JSON.parse(JSON.stringify(state));
        const cells = get(copy, location.cellId, location.swimlaneIndex)!;
        cells.push(action.cellData);
        return copy;
    } else if (action.type === 'JUMP') {
        const [copy, , cell] = copyAndSplice(state, action.id);
        const dest = get(copy, action.dropLocation.cellId, action.dropLocation.swimlaneIndex)!;
        dest.push(cell);
        return copy;
    } else {
        return state;
    }
}
