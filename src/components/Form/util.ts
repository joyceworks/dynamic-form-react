import { CellData, CellDataType, LanedCellData } from "./schema";
import { forEach } from "./Designer/util";
import React from "react";
import { InputCellData } from "./InputCell/schema";

export const InteractContext = React.createContext<any>(null);

export function getValues(cell: CellData): any {
  let result: any = {};
  const func = function (data: CellData) {
    if (data.lanes) {
      (data as LanedCellData).lanes.forEach((lane) => {
        lane.cellDataList.forEach((element) => {
          switch (element.type) {
            case "grid":
            case "tab":
              func(element);
              break;
            case "list":
              result[element.id] = [];
              (element as LanedCellData).lanes.forEach((childLane) => {
                let isEmpty = true;
                let detail: { [key: string]: any } = {};
                childLane.cellDataList.forEach((listElement: CellData) => {
                  if (listElement.value) {
                    isEmpty = false;
                    detail[listElement.id] = listElement.value;
                  }
                });
                if (!isEmpty) {
                  detail = { ...detail, ...childLane.hiddenValues };
                  result[element.id].push(detail);
                }
              });
              break;
            default:
              result[element.id] = element.value;
              break;
          }
        });
        result = { ...result, ...lane.hiddenValues };
      });
    }
  };
  func(cell);
  return result;
}

/**
 * Get value from cell data by id
 * @param root: root cell data
 * @param id: e.g., name, details.0.name, details.name
 */
export function getValue(root: CellData, id: string): any | any[] {
  let value: any = null;
  const strings = id.split(".");
  const id1 = strings[0];
  const func = function (data: CellData) {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (const element of lane.cellDataList) {
          switch (element.type) {
            case "grid":
            case "tab":
              func(element);
              break;
            default:
              if (element.id === id1) {
                if (element.type === "list") {
                  if (strings.length === 3) {
                    const index = parseInt(strings[1]);
                    const id2 = strings[2];
                    const row = (element as LanedCellData).lanes[index];
                    for (const item of row.cellDataList) {
                      if (item.id === id2) {
                        value = item.value;
                        return true;
                      }
                    }
                  } else {
                    value = [];
                    const id2 = strings[1];
                    for (const row of (element as LanedCellData).lanes) {
                      for (const item of row.cellDataList.filter(
                        (item) => item.id === id2
                      )) {
                        value.push(item.value);
                      }
                    }
                    return true;
                  }
                } else {
                  value = element.value;
                  return true;
                }
              }
              break;
          }
        }
      }
    }
    return false;
  };
  func(root);
  return value;
}

export function set(root: CellData, id: string, key: string, value: any): void {
  const strings = id.split(".");
  const id1 = strings[0];
  const func = function (data: CellData) {
    if (data.lanes) {
      for (const lane of data.lanes) {
        for (const element of lane.cellDataList) {
          switch (element.type) {
            case "grid":
            case "tab":
              func(element);
              break;
            default:
              if (element.id === id1) {
                if (element.type === "list") {
                  const index = parseInt(strings[1]);
                  const id2 = strings[2];
                  const row = element.lanes![index];
                  for (const item of row.cellDataList) {
                    if (item.id === id2) {
                      item[key] = value;
                      return true;
                    }
                  }
                } else {
                  element[key] = value;
                  return true;
                }
              }
              break;
          }
        }
      }
    }
    return false;
  };
  func(root);
}

function formatValue(value: any, type: CellDataType | string): any {
  if (type === "datetime") {
    return value.substr(0, 19).replace("T", " ");
  } else {
    return value;
  }
}

export function setData(root: CellData, form: any): void {
  const master: any = { ...form };
  (root as LanedCellData).lanes[0].hiddenValues = master;
  for (const cellData of (root as LanedCellData).lanes[0].cellDataList) {
    delete master[cellData.id];
    forEach(cellData, (item) => {
      const value = form[cellData.id];
      if (item.type !== "list" && item.type !== "grid" && item.type !== "tab") {
        cellData.value = value ? formatValue(value, cellData.type) : null;
      } else if (item.type === "list" && value) {
        for (const row of value) {
          const detail: any = { ...row };
          (item as LanedCellData).lanes.push({
            ...item.lanes[0],
            cellDataList: (item as LanedCellData).lanes[0].cellDataList.map(
              (x) => {
                delete detail[x.id];
                const y: CellData = {
                  ...x,
                };
                const value = row[x.id];
                y.value = value ? formatValue(value, y.type) : null;
                return y;
              }
            ),
            hiddenValues: detail,
          });
        }
        if ((item as LanedCellData).lanes.length > 1) {
          item.lanes?.splice(0, 1);
        }
      }
    });
  }
}

export function validateFormat(cellData: InputCellData): boolean {
  const isText = cellData.type === "input" || cellData.type === "textarea";
  if (
    isText &&
    cellData.value &&
    cellData.format &&
    cellData.format !== "none"
  ) {
    let pattern: string;
    if (cellData.format === "custom") {
      pattern = cellData.customFormat || "";
    } else if (cellData.format === "mobile") {
      pattern = "^1\\d{10}$";
    } else if (cellData.format === "email") {
      pattern = "^\\S+@\\S+$";
    } else {
      throw `Incorrect format type: ${cellData.format}.`;
    }
    if (!(cellData.value as string).match(pattern)) {
      return false;
    }
  }
  return true;
}

export function validateRequired(cellData: CellData): boolean {
  return !cellData.required || cellData.value;
}
