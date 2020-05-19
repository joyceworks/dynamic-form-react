import React, { useContext, useRef, useState } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";
import { FormContext } from "./components/GridCell/components/Pool";
import { InputCell } from "./components/InputCell";
import { GridCell } from "./components/GridCell";
import { SelectCell } from "./components/SelectCell";
import { createWidgetInstance } from "../../util";
import { DateCell } from "./components/DateCell";
import { TextAreaCell } from "./components/TextAreaCell";

interface CellProps {
  cellData: CellData;
  layout?: "inline" | "default";
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Cell = function ({
  cellData,
  index,
  layout = "default",
}: CellProps) {
  const data = {
    ...cellData,
    required: false,
    warnable: false,
    layout: "default",
    labeled: true,
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
      console.log(cellData.id);
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
          type: "MOVE",
          dragItemId: monitor.getItem().id,
          position: position,
          dropItemId: cellData.id,
        });
      } else {
        designerDispatch({
          type: "NOOB",
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
    begin: (monitor) => {
      console.log(monitor);
      designerDispatch({
        type: "ACTIVE",
        id: cellData.id,
      });
    },
  });
  drag(drop(ref));

  const dispatch = useContext(FormContext);
  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? "0.5" : 1 }}
      className={
        "instance" +
        (cellData.active ? " active" : "") +
        (isOver ? dropClassName : "")
      }
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
    >
      {cellData.type === "input" ? (
        <>
          <InputCell element={data} dispatch={dispatch} layout={layout} />
        </>
      ) : cellData.type === "textarea" ? (
        <>
          <TextAreaCell element={data} dispatch={dispatch} />
        </>
      ) : cellData.type === "grid" ? (
        <>
          <GridCell element={data} />
        </>
      ) : cellData.type === "list" ? (
        <>
          <GridCell element={data} direction={"row"} />
        </>
      ) : cellData.type === "select" ? (
        <>
          <SelectCell cellData={data} dispatch={dispatch} />
        </>
      ) : cellData.type === "datetime" ? (
        <DateCell data={data} dispatch={dispatch} />
      ) : (
        <></>
      )}
    </div>
  );
};
