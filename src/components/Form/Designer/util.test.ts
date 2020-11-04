import { cloneAndForEach, forEach, locate } from "./util";
import { CellData } from "../schema";

test("all ids changed", () => {
  const root = {
    id: "1",
    type: "grid",
    lanes: [
      {
        cellDataList: [
          {
            type: "grid",
            id: "2",
            lanes: [
              {
                cellDataList: [
                  {
                    type: "input",
                    id: "3",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  forEach(root, function (cellData) {
    cellData.id += "s";
  });
  expect(root.id).toBe("1s");
  expect(root.lanes[0].cellDataList[0].id).toBe("2s");
  expect(root.lanes[0].cellDataList[0].lanes[0].cellDataList[0].id).toBe("3s");
});

test("reference isn't changed", () => {
  const root = {
    id: "1",
    type: "grid",
    lanes: [
      {
        cellDataList: [
          {
            type: "grid",
            id: "2",
            lanes: [
              {
                cellDataList: [
                  {
                    type: "input",
                    id: "3",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const ref = root;
  forEach(root, function (cellData) {
    cellData.id += "s";
  });
  expect(root).toBe(ref);
});

test("reference is changed", () => {
  let root: CellData = {
    id: "1",
    type: "grid",
    lanes: [
      {
        cellDataList: [],
      },
    ],
  };
  const ref = root;
  root = cloneAndForEach(root, function (cellData) {
    cellData.id += "s";
  });
  expect(root === ref).toBe(false);
});

test("location is correct", () => {
  const root = {
    id: "1",
    type: "grid",
    lanes: [
      {
        cellDataList: [
          {
            type: "grid",
            id: "2",
            lanes: [
              {
                cellDataList: [
                  {
                    type: "input",
                    id: "3",
                  },
                  {
                    type: "input",
                    id: "4",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const location = locate(root, (value) => value.id === "4");
  expect(location !== null).toBe(true);
  const [cellLocation, cellList, cell] = location!;
  expect(cellLocation.index).toBe(1);
  expect(cellLocation.laneIndex).toBe(0);
  expect(cellLocation.parentId).toBe("2");
  expect(cellList.indexOf(cell)).toBe(cellLocation.index);
  expect(cell.id).toBe("4");
});
