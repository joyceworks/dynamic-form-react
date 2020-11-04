import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { Lane } from "./Lane";
import { CellData } from "../../../schema";
import { SwimlaneLocation } from "../../../schema/";
import { DesignerContext } from "../../index";
import { createWidgetInstance } from "../../util";
import { CustomCell } from "../../Cell";

interface LaneProps {
  cellDataList: CellData[];
  direction: "horizontal" | "vertical";
  location: SwimlaneLocation;
  span?: number;
  customCells?: CustomCell[];
}

export const DndLane = function ({
  cellDataList,
  direction,
  location,
  span = 24,
  customCells,
}: LaneProps) {
  const dispatch = useContext(DesignerContext);
  const [{ isOver }, drop] = useDrop({
    accept: [
      "input",
      "grid",
      "textarea",
      "select",
      "datetime",
      "checkbox",
      "list",
      "instance",
      "label",
      "tab",
      ...(customCells || []).map((item) => item.type),
    ],
    drop: (item: any, monitor) => {
      if (isOver) {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return;
        }

        if (item.type === "instance") {
          dispatch({
            type: "MOVE",
            id: item.id,
            location: location,
          });
        } else {
          let instance: CellData | null = null;
          if (customCells) {
            const find = customCells.find(
              (customCell) => customCell.type === item.type
            );
            if (find && find.createWidgetInstance) {
              instance = find.createWidgetInstance();
            }
          }
          if (!instance) {
            instance = createWidgetInstance(item.type as string);
          }
          dispatch({
            type: "ADD",
            dragItem: instance!,
            location: location,
          });
        }
      }
    },
    collect: (monitor) => {
      let isOver = monitor.isOver({ shallow: true });
      if (isOver && monitor.getItem().id === location.parentId) {
        isOver = false;
      }
      return { isOver: isOver };
    },
  });
  return (
    <Lane
      location={location}
      span={span}
      cellDataList={cellDataList}
      className={isOver ? " hovered" : ""}
      ref={drop}
      direction={direction}
      customCells={customCells}
    />
  );
};
