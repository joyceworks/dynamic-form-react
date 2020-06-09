import React, { useContext, useRef, useState } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";
import { createWidgetInstance } from "../../util";
import { Cell } from "../Cell";

interface DnDCellProps {
  cellData: CellData;
  layout?: "inline" | "default";
  index: number;
  className?: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DnDCell = function ({
  cellData,
  index,
  layout = "default",
  className,
}: DnDCellProps) {
  const data = {
    required: false,
    warnable: false,
    layout: "default",
    labeled: true,
    ...cellData,
  };
  const ref = useRef<any>(null);
  const designerDispatch = useContext(DesignerContext);
  const [dropClassName, setDropClassName] = useState<
    | ""
    | " drop-over-leftward"
    | " drop-over-rightward"
    | " drop-over-upward"
    | " drop-over-downward"
  >("");
  const [{ isOver }, drop] = useDrop({
    accept: [
      "instance",
      "input",
      "textarea",
      "select",
      "datetime",
      "grid",
      "list",
    ],
    hover: (item: DragItem, monitor) => {
      if (
        !ref.current ||
        !monitor.isOver({ shallow: true }) ||
        monitor.getItem().id === cellData.id ||
        !monitor.getClientOffset()
      ) {
        setDropClassName("");
        return;
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const coord = clientOffset as XYCoord;
      if (layout === "default") {
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = coord.y - hoverBoundingRect.top;
        setDropClassName(
          hoverClientY > hoverMiddleY
            ? " drop-over-downward"
            : " drop-over-upward"
        );
      } else {
        const hoverMiddleX =
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const hoverClientX = coord.x - hoverBoundingRect.left;
        setDropClassName(
          hoverClientX > hoverMiddleX
            ? " drop-over-rightward"
            : " drop-over-leftward"
        );
      }
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver({ shallow: true }),
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      let position: "up" | "down";
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      if (layout === "default") {
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;
        position = hoverClientY > hoverMiddleY ? "down" : "up";
      } else {
        const hoverMiddleX =
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const hoverClientX =
          (clientOffset as XYCoord).x - hoverBoundingRect.left;
        position = hoverClientX > hoverMiddleX ? "down" : "up";
      }

      if (item.type === "instance") {
        designerDispatch({
          type: "POSITIONED_MOVE",
          id: monitor.getItem().id,
          position: position,
          dropItemId: cellData.id,
        });
      } else {
        designerDispatch({
          type: "POSITIONED_ADD",
          position: position,
          dropItemId: cellData.id,
          dragItem: createWidgetInstance(item.type as string),
        });
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "instance", id: cellData.id, index },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
    begin: () => {
      designerDispatch({
        type: "ACTIVE",
        id: cellData.id,
      });
    },
  });
  drag(drop(ref));

  return (
    <>
      <Cell
        className={`${isOver ? dropClassName : ""} ${className || ""}`}
        onClick={(event) => {
          event.stopPropagation();
          designerDispatch({
            type: "ACTIVE",
            id: cellData.id,
          });
          designerDispatch({
            type: "EDIT",
            id: cellData.id,
          });
        }}
        ref={ref}
        style={{ opacity: isDragging ? "0.5" : 1 }}
        cellData={data}
        layout={layout}
      />
    </>
  );
};
