import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { Cell } from "../../../../../../index";
import { CellData } from "../../../../../../../../schemas/CellData";
import { DesignerContext } from "../../../../../../../../index";
import SwimlaneLocation from "../../../../../../../../schemas/SwimlaneLocation";
import { createWidgetInstance } from "../../../../../../../../util";

interface LaneProps {
  cellDataList: CellData[];
  direction: "column" | "row";
  location: SwimlaneLocation;
}

export const Lane = function ({
  cellDataList,
  direction,
  location,
}: LaneProps) {
  const dispatch = useContext(DesignerContext);
  const [{ isOver }, drop] = useDrop({
    accept: ["input", "textarea", "grid", "select", "datetime", "instance"],
    drop: (item: any, monitor) => {
      if (isOver) {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return;
        }

        if (item.type === "instance") {
          dispatch({
            type: "FARM",
            cellDataId: item.id,
            location: location,
          });
        } else {
          dispatch({
            type: "ADD",
            cellData: createWidgetInstance(item.type as string),
            location: Object.assign({}, location, {
              index: cellDataList.length,
            }),
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

  const layout = direction === "column" ? "default" : "inline";
  const cells = cellDataList.map((child, index) => (
    <Cell key={child.id} layout={layout} cellData={child} index={index} />
  ));

  return (
    <td className={"lane " + direction + (isOver ? " hovered" : "")} ref={drop}>
      {cells}
    </td>
  );
};
