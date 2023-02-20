import {
  CellData,
  CellLocation,
  LanedCellData,
  ReducerActionProps,
} from "../schema";
import { set, validateFormat, validateRequired } from "../util";
import { DragItem } from "./DnDCell";
import { CustomCell } from "./Cell";
import { InputCellData } from "./Cell/InputCell/schema";

export function clone(src: CellData): CellData {
  const copy = JSON.parse(JSON.stringify(src));
  forEach(src, (src) => {
    forEach(copy, (dest) => {
      if (dest.id === src.id) {
        if (typeof src.required === "function") {
          dest.required = src.required;
        }
        if (src.onChange) {
          dest.onChange = src.onChange;
        }
        if (src.onClick) {
          dest.onClick = src.onClick;
        }
      }
    });
  });
  return copy;
}

/**
 * Clone and iterate nested CellData
 * @param root
 * @param handler
 */
export function cloneAndForEach(
  root: CellData,
  handler: (
    value: CellData,
    index: number | null,
    array: CellData[] | null
  ) => void
): CellData {
  const copy = clone(root);
  forEach(copy, handler);
  return copy;
}

/**
 * Iterate nested CellData
 * @param root
 * @param handler
 */
export function forEach(
  root: CellData,
  handler: (
    value: CellData,
    index: number | null,
    array: CellData[] | null
  ) => void
): void {
  const recursion = function (data: CellData): void {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (let i = 0; i < lane.cellDataList.length; i++) {
          const cellData = lane.cellDataList[i];
          handler(cellData, i, lane.cellDataList);
          if (
            cellData.type === "grid" ||
            cellData.type === "list" ||
            cellData.type === "tab"
          ) {
            recursion(cellData);
          }
        }
      }
    }
  };
  handler(root, null, null);
  recursion(root);
}

export function filter(
  root: CellData,
  predicate: ((item: CellData) => boolean) | string
): CellData[] {
  const result: CellData[] = [];
  forEach(root, (value) => {
    if (
      (typeof predicate === "function" && predicate(value)) ||
      (typeof predicate === "string" && value.type === predicate)
    ) {
      result.push(value);
    }
  });
  return result;
}

export function locate(
  root: CellData,
  matchFunc: (value: CellData, index: number, array: CellData[]) => boolean
): [CellLocation, CellData[], CellData] | null {
  let location: [CellLocation, CellData[], CellData] | null = null;
  const func = function (
    data: CellData
  ): [CellLocation, CellData[], CellData] | null {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (let i = 0; i < lane.cellDataList.length; i++) {
          const cellData = lane.cellDataList[i];
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
          if (
            cellData.type === "grid" ||
            cellData.type === "list" ||
            cellData.type === "tab"
          ) {
            func(cellData);
          }
        }
      }
    }
    return location;
  };
  return func(root);
}

export function deleteActive(rootCellData: CellData): void {
  const location = locate(
    rootCellData,
    (item) => item.active !== undefined && item.active
  );
  if (location) {
    const [cellLocation, list] = location;
    list.splice(cellLocation.index, 1);
  }
}

export function getCellDataList(
  root: CellData,
  parentId: string,
  index: number
): CellData[] | null {
  let list: CellData[] | null = null;
  const func = function (data: CellData) {
    if (data.id === parentId) {
      return (data as LanedCellData).lanes[index].cellDataList;
    }
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (const cellData of lane.cellDataList) {
          if (
            cellData.type === "grid" ||
            cellData.type === "list" ||
            cellData.type === "tab"
          ) {
            if (cellData.id === parentId) {
              list = (cellData as LanedCellData).lanes[index].cellDataList;
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
  position: "up" | "down"
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

export function reducer(state: any, action: ReducerActionProps): CellData {
  if (!action.type) {
    return state;
  }
  if (action.type === "INIT") {
    return action.data;
  }
  const copy = clone(state);
  if (action.type === "POSITIONED_MOVE") {
    const [dragLocation, dragList, dragCell] = locate(
      copy,
      (item) => item.id === action.id
    )!;
    const location = locate(copy, (item) => item.id === action.dropItemId);
    if (location) {
      dragList.splice(dragLocation.index, 1);
      drop(copy, dragCell, action.dropItemId, action.position);
    }
  } else if (action.type === "POSITIONED_ADD") {
    const location = locate(copy, (item) => item.id === action.dropItemId);
    if (location) {
      drop(copy, action.dragItem, action.dropItemId, action.position);
    }
  } else if (action.type === "ADD") {
    const cells = getCellDataList(
      copy,
      action.location.parentId,
      action.location.index
    )!;
    cells.push(action.dragItem);
    active(copy, action.dragItem.id);
  } else if (action.type === "UPDATE") {
    const [location, list] = locate(
      copy,
      (data) => data.id === (action.id || action.data.id)
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
      action.location.index
    );
    cellDataList?.push(cell);
    active(copy, cell.id);
  } else if (action.type === "DELETE") {
    const [location, list] = locate(copy, (item) => item.id === action.id)!;
    list.splice(location.index, 1);
  } else if (action.type === "ACTIVE") {
    active(copy, action.id);
  } else if (action.type === "DELETE_ACTIVE") {
    deleteActive(copy);
  } else if (action.type === "SET") {
    set(copy, action.targetId, action.key, action.value);
  } else if (action.type === "SET_VALUE") {
    set(copy, action.targetId, "value", action.value);
  } else if (action.type === "SET_OPTION") {
    set(copy, action.targetId, "options", action.options);
  } else if (action.type === "VALIDATE") {
    return cloneAndForEach(state, function (cellData) {
      if (!validateRequired(cellData)) {
        cellData.warning = `${cellData.label} is required.`;
        cellData.warnable = true;
      } else if (!validateFormat(cellData as InputCellData)) {
        cellData.warning = `${cellData.label} is incorrect.`;
        cellData.warnable = true;
      } else {
        cellData.warnable = false;
        cellData.warning = "";
      }
    });
  } else if (action.type === "DELETE_LANE") {
    const location = locate(copy, (value) => value.id === action.parentId);
    if (location) {
      if (location[2].lanes.length > 1) {
        location[2].lanes.splice(action.index, 1);
      } else {
        alert(`最后一行无法删除`);
      }
    }
  }
  return copy;
}

export function getActive(root: CellData): CellData | null {
  const location = locate(
    root,
    (item) => item.active !== undefined && item.active
  );
  return location ? location[2] : null;
}

export function active(root: CellData, id: string): void {
  forEach(root, function (cellData) {
    cellData.active = id === cellData.id;
  });
}

export function createWidgetInstance(
  item: DragItem,
  customCells?: CustomCell[]
): CellData {
  if (item.createWidgetInstance) {
    return item.createWidgetInstance();
  } else if (customCells) {
    const find = customCells.find(
      (customCell) => customCell.type === item.type
    );
    if (find && find.createWidgetInstance) {
      return find.createWidgetInstance();
    }
  }
  return createBasicWidgetInstance(item.type);
}

export function createBasicWidgetInstance(type: string): CellData {
  const cellData: CellData = {
    type: type,
    id: type + new Date().getTime().toString(32),
    active: false,
    label: type,
  };
  if (cellData.type === "grid") {
    cellData.lanes = [
      { span: 12, cellDataList: [] },
      { span: 12, cellDataList: [] },
    ];
  } else if (cellData.type === "tab") {
    cellData.lanes = [
      { span: 24, cellDataList: [] },
      { span: 0, cellDataList: [] },
    ];
    cellData.tabs = ["Tab 1", "Tab 2"];
  } else if (cellData.type === "list") {
    cellData.label = "List";
    cellData.lanes = [{ cellDataList: [], span: 100 }];
  } else if (cellData.type === "select") {
    cellData.options = [];
  }
  return cellData;
}
