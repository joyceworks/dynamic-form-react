import React from "react";
import { AiOutlineMenu, AiOutlineMinusCircle } from "react-icons/ai";
import { Button, InputNumber } from "antd";
import { LaneData } from "../../../schema";
import { useVerticalDragDropMemberRef } from "../../../../hook";

interface DragItem {
  index: number;
  type: string;
}

interface LaneConfigProps {
  index: number;
  data: LaneData;
  move: (from: number, to: number) => void;
  onRemove: () => void;
  onResize: (span: string | number | undefined) => void;
}

export default function LaneConfig({
  index,
  data,
  move,
  onRemove,
  onResize,
}: LaneConfigProps) {
  const ref = useVerticalDragDropMemberRef(index, move);
  return (
    <>
      <div ref={ref}>
        <AiOutlineMenu style={{ cursor: "move" }} />
        <InputNumber
          onChange={onResize}
          value={data.span}
          size={"small"}
          style={{
            width: "60px",
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
