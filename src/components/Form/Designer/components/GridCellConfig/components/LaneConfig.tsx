import React, { useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { AiOutlineMenu, AiOutlineMinusCircle } from "react-icons/ai";
import { Button, InputNumber } from "antd";
import { LaneData } from "../../../schemas/LaneData";

interface DragItem {
  index: number;
  type: string;
}

interface LaneConfigProps {
  index: number;
  data: LaneData;
  move: (from: number, to: number) => void;
  onRemove: () => void;
  onResize: (span: number | undefined) => void;
}

export default function LaneConfig({
  index,
  data,
  move,
  onRemove,
  onResize,
}: LaneConfigProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag({
    item: {
      type: "config",
      index: index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "config",
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  drag(drop(ref));
  return (
    <>
      <div ref={ref}>
        <AiOutlineMenu style={{ cursor: "move" }} />
        <InputNumber
          onChange={onResize}
          value={data.span}
          size={"small"}
          style={{
            width: "160px",
            margin: "0 4px",
          }}
        />
        <Button type={"link"} onClick={onRemove} style={{ padding: "0" }}>
          <AiOutlineMinusCircle />
        </Button>
      </div>
    </>
  );
}
