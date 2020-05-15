import { CellData } from "./schemas/CellData";
import CellLocation from "./schemas/CellLocation";

export function locate(
  root: CellData,
  matchFunc: (value: CellData, index: number, array: CellData[]) => boolean
): [CellLocation, CellData[], CellData] | null {
  let location: [CellLocation, CellData[], CellData] | null = null;
  let func = function (
    data: CellData
  ): [CellLocation, CellData[], CellData] | null {
    if (data.swimlanes) {
      for (const swimlane of data.swimlanes) {
        for (let i = 0; i < swimlane.cellDataList.length; i++) {
          let cellData = swimlane.cellDataList[i];
          if (matchFunc(cellData, i, swimlane.cellDataList)) {
            location = [
              {
                parentId: data.id,
                swimlaneIndex: data.swimlanes?.indexOf(swimlane),
                index: i,
              },
              swimlane.cellDataList,
              cellData,
            ];
            break;
          }
          if (cellData.type === "grid") {
            func(cellData);
          }
        }
      }
    }
    return location;
  };
  return func(root);
}

export function deleteActive(rootCellData: CellData) {
  const location = locate(rootCellData, (item) => item.active);
  if (location) {
    const [cellLocation, list] = location;
    list.splice(cellLocation.index, 1);
  }
}

export function getCellDataList(
  root: CellData,
  parentId: string,
  swimlaneIndex: number
): CellData[] | null {
  let list: CellData[] | null = null;
  let func = function (data: CellData) {
    if (data.id === parentId) {
      return data.swimlanes![swimlaneIndex].cellDataList;
    }
    if (data.swimlanes) {
      for (const swimlane of data.swimlanes) {
        for (const cellData of swimlane.cellDataList) {
          if (cellData.type === "grid") {
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
  return func(root);
}

export function reducer(state: any, action: any) {
  if (!action.type) {
    return state;
  }
  if (action.type === "MOVE") {
    const copy = JSON.parse(JSON.stringify(state));
    const [dropLocation, dropList] = locate(copy, action.dropItemId)!;
    const [dragLocation, dragList, dragCell] = locate(copy, action.dragItemId)!;
    if (action.position === "up") {
      dropList.splice(dropLocation.index, 0, dragCell);
    } else {
      dropList.splice(dropLocation.index + 1, 0, dragCell);
    }
    let dragIndex: number;
    if (dragList === dropList) {
      dragIndex = dragList.indexOf(dragCell);
    } else {
      dragIndex = dragLocation.index;
    }
    dragList.splice(dragIndex, 1);
    return copy;
  } else if (action.type === "ADD") {
    const copy = JSON.parse(JSON.stringify(state));
    const cells = getCellDataList(
      copy,
      action.location.parentId,
      action.location.swimlaneIndex
    )!;
    cells.push(action.cellData);
    active(copy, action.cellData.id);
    return copy;
  } else if (action.type === "ACTIVE") {
    const copy = JSON.parse(JSON.stringify(state));
    active(copy, action.id);
    return copy;
  } else if (action.type === "DELETE_ACTIVE") {
    const copy = JSON.parse(JSON.stringify(state));
    deleteActive(copy);
    return copy;
  }
}

export function getActive(root: CellData): CellData | null {
  const location = locate(root, (item) => item.active);
  return location ? location[2] : null;
}

export function active(root: CellData, id: string) {
  const prevLocation = locate(root, (item) => item.active);
  if (prevLocation) {
    prevLocation[2].active = false;
  }
  const currentLocation = locate(root, (item) => item.id === id);
  if (currentLocation) {
    currentLocation[2].active = true;
  }
}
