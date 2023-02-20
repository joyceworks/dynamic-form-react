import React from "react";
import { Button, InputNumber } from "antd";
import { LaneData } from "../../../schema";
import { useVerticalDragDropMemberRef } from "../../../../hook";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import MinusCircleOutlined from "@ant-design/icons/MinusCircleOutlined";

interface LaneConfigProps {
  index: number;
  data: LaneData;
  move: (from: number, to: number) => void;
  onRemove: () => void;
  onResize: (span: number | null) => void;
}

export default function LaneConfig({
  index,
  data,
  move,
  onRemove,
  onResize,
}: LaneConfigProps): JSX.Element {
  const ref = useVerticalDragDropMemberRef(index, move);
  return (
    <>
      <div ref={ref}>
        <MenuOutlined style={{ cursor: "move" }} />
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
          <MinusCircleOutlined />
        </Button>
      </div>
    </>
  );
}
