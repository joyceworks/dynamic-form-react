import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { Lane } from "./Lane";
import { CellData, SwimlaneLocation } from "../../../../schema";
import { DesignerContext } from "../../../index";
import { createWidgetInstance } from "../../../util";
import { CustomCell } from "../../index";
import { DragItem } from "../../../DnDCell";

interface LaneProps {
  cellDataList: CellData[];
  direction: "horizontal" | "vertical";
  location: SwimlaneLocation;
  span?: number;
  customCells?: CustomCell[];
  disabled?: boolean;
}

export const DndLane = function ({
  cellDataList,
  direction,
  location,
  span = 24,
  customCells,
  disabled,
}: LaneProps): JSX.Element {
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
    drop: (item: DragItem, monitor) => {
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
          const instance = createWidgetInstance(item, customCells);
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
      disabled={disabled}
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
