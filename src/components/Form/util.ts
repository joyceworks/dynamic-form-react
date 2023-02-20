import { CellData, CellDataType, LanedCellData } from "./schema";
import { forEach } from "./Designer/util";
import React from "react";
import { InputCellData } from "./Designer/Cell/InputCell/schema";
import {NestedFormData, FormData} from "../schema";

export const InteractionContext = React.createContext<any>(null);

export function getValues(cell: CellData): NestedFormData {
  let result: NestedFormData = {};
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
                let detail: FormData = {};
                childLane.cellDataList.forEach((listElement: CellData) => {
                  if (listElement.value) {
                    isEmpty = false;
                    detail[listElement.id] = listElement.value;
                  }
                });
                if (!isEmpty) {
                  detail = { ...detail, ...childLane.hiddenValues };
                  (result[element.id] as NestedFormData[]).push(detail);
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
export function getValue(root: CellData, id: string): unknown {
  return get(root, id, "value");
}

export function get(root: CellData, id: string, key: string): unknown {
  let value: unknown = null;
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
                    // detail.1.price
                    const index = parseInt(strings[1]);
                    const id2 = strings[2];
                    const row = (element as LanedCellData).lanes[index];
                    for (const item of row.cellDataList) {
                      if (item.id === id2) {
                        value = item[key];
                        return true;
                      }
                    }
                  } else if (strings.length === 2) {
                    // detail.price
                    value = [];
                    const id2 = strings[1];
                    for (const row of (element as LanedCellData).lanes) {
                      for (const item of row.cellDataList.filter(
                        (item) => item.id === id2
                      )) {
                        (value as Array<unknown>).push(item[key]);
                      }
                    }
                    return true;
                  } else {
                    throw `Unsupported index length: ${strings.length} of ${id}`;
                  }
                } else {
                  value = element[key];
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

export function set(
  root: CellData,
  id: string,
  key: string,
  value: unknown
): void {
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

function formatValue(value: unknown, type: CellDataType | string): unknown {
  if (type === "datetime") {
    return (value as string).substr(0, 19).replace("T", " ");
  } else {
    return value;
  }
}

export function setData(root: CellData, form: NestedFormData): void {
  const master: FormData = { ...form };
  (root as LanedCellData).lanes[0].hiddenValues = master;
  for (const cellData of (root as LanedCellData).lanes[0].cellDataList) {
    delete master[cellData.id];
    forEach(cellData, (item) => {
      const value = form[cellData.id];
      if (item.type !== "list" && item.type !== "grid" && item.type !== "tab") {
        cellData.value = value ? formatValue(value, cellData.type) : null;
      } else if (item.type === "list" && value) {
        for (const row of value as FormData[]) {
          const detail: FormData = { ...row };
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
  return !cellData.required || !!cellData.value;
}
