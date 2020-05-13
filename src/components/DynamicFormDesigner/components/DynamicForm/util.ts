import { CellData } from "../../schemas/CellData";

export function getData(cell: CellData) {
  let result = {};
  let func = function (data: CellData, result: { [key: string]: any }) {
    if (data.swimlanes) {
      data.swimlanes.forEach((swimlane) => {
        swimlane.cellDataList.forEach((element) => {
          switch (element.type) {
            case "grid":
              func(element, result);
              break;
            case "list":
              result[element.id] = [];
              // @ts-ignore
              element.swimlanes.forEach((row, index) => {
                if (index > 0) {
                  let rowResult: { [key: string]: any } = {};
                  row.cellDataList.forEach((listElement: CellData) => {
                    rowResult[listElement.id] = listElement.value;
                  });
                  result[element.id].push(rowResult);
                }
              });
              break;
            default:
              result[element.id] = element.value;
              break;
          }
        });
      });
    }
  };
  func(cell, result);
  return result;
}

export function active(root: CellData, id: string) {
  let func = function (data: CellData) {
    data.active = data.id === id;
    if (data.swimlanes) {
      data.swimlanes.forEach((swimlane) => {
        swimlane.cellDataList.forEach((element) => {
          switch (element.type) {
            case "grid":
              func(element);
              break;
            case "list":
              element.swimlanes!.forEach((row) => {
                row.cellDataList.forEach((listElement: CellData) => {
                  listElement.active = listElement.id === id;
                });
              });
              break;
            default:
              element.active = element.id === id;
              break;
          }
        });
      });
    }
  };
  func(root);
}

export function setValue(cell: CellData, target: CellData, value: any) {
  let func = function (data: CellData) {
    if (data.swimlanes) {
      for (const swimlane of data.swimlanes) {
        for (const element of swimlane.cellDataList) {
          switch (element.type) {
            case "grid":
              func(element);
              break;
            case "list":
              // @ts-ignore
              for (const row of element.swimlanes) {
                for (let i = 0; i < row.cellDataList.length; i++) {
                  let listElement = row.cellDataList[i];
                  if (listElement === target) {
                    listElement.value = value;
                    return true;
                  }
                }
              }
              break;
            default:
              if (element === target) {
                element.value = value;
                return true;
              }
              break;
          }
        }
      }
    }
    return false;
  };
  return func(cell);
}
