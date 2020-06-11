import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { Lane } from "./Lane";
import { CellData } from "../../../../../schemas/CellData";
import SwimlaneLocation from "../../../../../schemas/SwimlaneLocation";
import { DesignerContext } from "../../../../../index";
import { createWidgetInstance } from "../../../../../util";

interface LaneProps {
  cellDataList: CellData[];
  direction: "horizontal" | "vertical";
  location: SwimlaneLocation;
  span?: number;
}

export const DndLane = function ({
  cellDataList,
  direction,
  location,
  span,
}: LaneProps) {
  const dispatch = useContext(DesignerContext);
  const [{ isOver }, drop] = useDrop({
    accept: [
      "input",
      "textarea",
      "grid",
      "select",
      "datetime",
      "checkbox",
      "list",
      "instance",
      "label",
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
          dispatch({
            type: "ADD",
            dragItem: createWidgetInstance(item.type),
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
      span={span}
      cellDataList={cellDataList}
      className={isOver ? " hovered" : ""}
      ref={drop}
      direction={direction}
    />
  );
};
