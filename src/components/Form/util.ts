import { CellData } from "./schema";
import { forEach } from "./Designer/util";
import { CellDataType } from "./type";
import React from "react";

export const InteractContext = React.createContext<any>(null);

export function getValues(cell: CellData): any {
  let result: any = {};
  let func = function (data: CellData) {
    if (data.lanes) {
      data.lanes.forEach((lane) => {
        lane.cellDataList.forEach((element) => {
          switch (element.type) {
            case "grid":
              func(element);
              break;
            case "list":
              result[element.id] = [];
              element.lanes!.forEach((childLane) => {
                let detail: { [key: string]: any } = {};
                childLane.cellDataList.forEach((listElement: CellData) => {
                  detail[listElement.id] = listElement.value;
                });
                detail = { ...detail, ...childLane.hiddenValues };
                result[element.id].push(detail);
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
  let func = function (data: CellData) {
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
                    const row = element.lanes![index];
                    for (let item of row.cellDataList) {
                      if (item.id === id2) {
                        value = item.value;
                        return true;
                      }
                    }
                  } else {
                    value = [];
                    const id2 = strings[1];
                    for (const row of element.lanes!) {
                      for (let item of row.cellDataList.filter(
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
  let func = function (data: CellData) {
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
                  for (let item of row.cellDataList) {
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
  root.lanes![0].hiddenValues = master;
  for (let cellData of root.lanes![0].cellDataList) {
    delete master[cellData.id];
    forEach(cellData, (item) => {
      const value = form[cellData.id];
      if (item.type !== "list" && item.type !== "grid" && item.type !== "tab") {
        cellData.value = value ? formatValue(value, cellData.type) : null;
      } else if (item.type === "list" && value) {
        for (const row of value) {
          const detail: any = { ...row };
          item.lanes?.push({
            ...item.lanes[0],
            cellDataList: item.lanes[0].cellDataList.map((x) => {
              delete detail[x.id];
              const y: CellData = {
                ...x,
              };
              const value = row[x.id];
              y.value = value ? formatValue(value, y.type) : null;
              return y;
            }),
            hiddenValues: detail,
          });
        }
        if (item.lanes!.length > 1) {
          item.lanes?.splice(0, 1);
        }
      }
    });
  }
}
