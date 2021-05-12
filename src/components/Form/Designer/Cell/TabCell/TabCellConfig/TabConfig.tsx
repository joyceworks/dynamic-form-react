import React from "react";
import { AiOutlineMenu, AiOutlineMinusCircle } from "react-icons/ai";
import { Button, Input } from "antd";
import { useVerticalDragDropMemberRef } from "../../../../../hook";

interface DragItem {
  index: number;
  type: string;
}

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
        <AiOutlineMenu style={{ cursor: "move" }} />
        <Input
          onChange={(event) => onRename(event.target.value)}
          value={name}
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
