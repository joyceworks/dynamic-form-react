import React from "react";
import { Button, Input } from "antd";
import { useVerticalDragDropMemberRef } from "../../../../../hook";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import MinusCircleOutlined from "@ant-design/icons/MinusCircleOutlined";

interface TabConfigProps {
  index: number;
  name: string;
  move: (from: number, to: number) => void;
  onRemove: () => void;
  onRename: (tab: string) => void;
}

export default function TabConfig({
  index,
  name,
  move,
  onRemove,
  onRename,
}: TabConfigProps) {
  const ref = useVerticalDragDropMemberRef(index, move);
  return (
    <>
      <div ref={ref}>
        <MenuOutlined style={{ cursor: "move" }} />
        <Input
          onChange={(event) => onRename(event.target.value)}
          value={name}
          size={"small"}
          style={{
            width: "60px",
            margin: "0 4px",
          }}
        />
        <Button type={"link"} onClick={onRemove} className="p-0">
          <MinusCircleOutlined />
        </Button>
      </div>
    </>
  );
}
