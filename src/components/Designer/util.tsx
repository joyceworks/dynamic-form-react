import { CellData } from "./schemas/CellData";
import CellLocation from "./schemas/CellLocation";
import {
  DispatchActiveProps,
  DispatchAddProps,
  DispatchDeleteActiveProps,
  DispatchEditProps,
  DispatchMoveProps,
  DispatchPositionedAddProps,
  DispatchPositionedMove,
  DispatchUpdateProps,
} from "./index";

export function peek(
  root: CellData,
  func: (
    value: CellData,
    index: number | null,
    array: CellData[] | null
  ) => void
) {
  const copy = JSON.parse(JSON.stringify(root));
  let recursion = function (data: CellData): void {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (let i = 0; i < lane.cellDataList.length; i++) {
          let cellData = lane.cellDataList[i];
          func(cellData, i, lane.cellDataList);
          if (cellData.type === "grid" || cellData.type === "list") {
            recursion(cellData);
          }
        }
      }
    }
  };
  func(copy, null, null);
  recursion(copy);
  return copy;
}

export function locate(
  root: CellData,
  matchFunc: (value: CellData, index: number, array: CellData[]) => boolean
): [CellLocation, CellData[], CellData] | null {
  let location: [CellLocation, CellData[], CellData] | null = null;
  let func = function (
    data: CellData
  ): [CellLocation, CellData[], CellData] | null {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (let i = 0; i < lane.cellDataList.length; i++) {
          let cellData = lane.cellDataList[i];
          if (matchFunc(cellData, i, lane.cellDataList)) {
            location = [
              {
                parentId: data.id,
                laneIndex: data.lanes?.indexOf(lane),
                index: i,
              },
              lane.cellDataList,
              cellData,
            ];
            break;
          }
          if (cellData.type === "grid" || cellData.type === "list") {
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
  laneIndex: number
): CellData[] | null {
  let list: CellData[] | null = null;
  let func = function (data: CellData) {
    if (data.id === parentId) {
      return data.lanes![laneIndex].cellDataList;
    }
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (const cellData of lane.cellDataList) {
          if (cellData.type === "grid" || cellData.type === "list") {
            if (cellData.id === parentId) {
              list = cellData.lanes![laneIndex].cellDataList;
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

function drop(
  root: CellData,
  cell: CellData,
  dropItemId: string,
  position: string
) {
  const [dropLocation, dropList] = locate(
    root,
    (item) => item.id === dropItemId
  )!;
  if (position === "up") {
    dropList.splice(dropLocation.index, 0, cell);
  } else {
    dropList.splice(dropLocation.index + 1, 0, cell);
  }
  active(root, cell.id);
}
export function reducer(
  state: any,
  action:
    | DispatchPositionedMove
    | DispatchPositionedAddProps
    | DispatchActiveProps
    | DispatchEditProps
    | DispatchMoveProps
    | DispatchAddProps
    | DispatchUpdateProps
    | DispatchDeleteActiveProps
): CellData {
  if (!action.type) {
    return state;
  }
  const copy = JSON.parse(JSON.stringify(state));
  if (action.type === "POSITIONED_MOVE") {
    const [dragLocation, dragList, dragCell] = locate(
      copy,
      (item) => item.id === action.id
    )!;
    dragList.splice(dragLocation.index, 1);
    drop(copy, dragCell, action.dropItemId, action.position);
  } else if (action.type === "POSITIONED_ADD") {
    drop(copy, action.dragItem, action.dropItemId, action.position);
  } else if (action.type === "ADD") {
    const cells = getCellDataList(
      copy,
      action.location.parentId,
      action.location.laneIndex
    )!;
    cells.push(action.dragItem);
    active(copy, action.dragItem.id);
  } else if (action.type === "UPDATE") {
    const [location, list] = locate(
      copy,
      (data) => data.id === action.data.id
    )!;
    list.splice(location.index, 1, action.data);
  } else if (action.type === "MOVE") {
    const [location, list, cell] = locate(
      copy,
      (item) => item.id === action.id
    )!;
    list.splice(location.index, 1);
    const cellDataList = getCellDataList(
      copy,
      action.location.parentId,
      action.location.laneIndex
    );
    cellDataList?.push(cell);
    active(copy, cell.id);
  } else if (action.type === "ACTIVE") {
    active(copy, action.id);
  } else if (action.type === "DELETE_ACTIVE") {
    deleteActive(copy);
  }
  return copy;
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

export function createWidgetInstance(type: string) {
  let cellData: CellData = {
    type: type,
    id: type + new Date().getTime(),
    active: false,
  };
  if (cellData.type === "grid") {
    cellData.lanes = [
      { span: 50, cellDataList: [] },
      { span: 50, cellDataList: [] },
    ];
  } else if (cellData.type === "input") {
    cellData.label = "单行文本";
    cellData.placeholder = "请填写";
    cellData.required = false;
  } else if (cellData.type === "textarea") {
    cellData.label = "多行文本";
    cellData.placeholder = "请填写";
    cellData.required = false;
  } else if (cellData.type === "select") {
    cellData.label = "下拉选择";
    cellData.placeholder = "请选择";
    cellData.options = [];
    cellData.required = false;
  } else if (cellData.type === "list") {
    cellData.label = "列表";
    cellData.lanes = [{ cellDataList: [], span: 100 }];
  } else if (cellData.type === "datetime") {
    cellData.label = "日期时间";
    cellData.placeholder = "请选择";
    cellData.required = false;
  } else if (cellData.type === "checkbox") {
    cellData.label = "多选";
    cellData.options = [];
    cellData.required = false;
  } else if (cellData.type === "radio") {
    cellData.label = "单选";
    cellData.options = [];
    cellData.required = false;
  }
  return cellData;
}
