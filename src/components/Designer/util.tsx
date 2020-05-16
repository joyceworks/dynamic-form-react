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
          if (cellData.type === "grid") {
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

export function reducer(state: any, action: any): CellData {
  if (!action.type) {
    return state;
  }
  const copy = JSON.parse(JSON.stringify(state));
  if (action.type === "MOVE") {
    const [dragLocation, dragList, dragCell] = locate(
      copy,
      (item) => item.id === action.dragItemId
    )!;
    dragList.splice(dragLocation.index, 1);
    drop(copy, dragCell, action.dropItemId, action.position);
  } else if (action.type === "NOOB") {
    drop(copy, action.dragItem, action.dropItemId, action.position);
  } else if (action.type === "ADD") {
    const cells = getCellDataList(
      copy,
      action.location.parentId,
      action.location.laneIndex
    )!;
    cells.push(action.cellData);
    active(copy, action.cellData.id);
  } else if (action.type === "FARM") {
    const [location, list, cell] = locate(
      copy,
      (item) => item.id === action.cellDataId
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

export function createWidgetInstance(widgetType: string) {
  let cellData: CellData = {
    type: widgetType,
    id: widgetType + new Date().getTime(),
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
