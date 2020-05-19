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

export const Cell = function ({ cellData, index, layout }: CellProps) {
  const data = {
    ...cellData,
    required: false,
    warnable: false,
    layout: "default",
    labeled: true,
  };
  const ref = useRef<any>(null);
  const designerDispatch = useContext(DesignerContext);
  const [dropClassName, setDropClassName] = useState<string>("");
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
      if (!ref.current) {
        setDropClassName("");
      }
      if (!monitor.isOver({ shallow: true })) {
        setDropClassName("");
      }
      if (monitor.getItem().id === cellData.id) {
        setDropClassName("");
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        setDropClassName("");
      }
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      setDropClassName(
        hoverClientY > hoverMiddleY
          ? " drop-over-downward"
          : " drop-over-upward"
      );
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

      let position = null;
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (hoverClientY > hoverMiddleY) {
        position = "down";
      } else {
        position = "up";
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
