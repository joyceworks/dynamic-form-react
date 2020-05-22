import React, { useContext } from "react";
import LaneConfig from "./components/LaneConfig";
import update from "immutability-helper";
import { Button } from "antd";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";

interface GridCellConfigProps {
  active: CellData;
}

export default function GridCellConfig({ active }: GridCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      列配置项
      {active &&
        active.lanes &&
        active.lanes.map((lane, index) => (
          <LaneConfig
            key={"lane-config-" + index}
            index={index}
            data={lane}
            onResize={(span) => {
              designerDispatch({
                type: "UPDATE",
                data: {
                  ...active,
                  lanes: update(active.lanes, {
                    [index]: {
                      span: { $set: span || 0 },
                    },
                  }),
                },
              });
            }}
            onRemove={() => {
              designerDispatch({
                type: "UPDATE",
                data: {
                  ...active,
                  lanes: update(active.lanes, {
                    $splice: [[index, 1]],
                  }),
                },
              });
            }}
            move={(from, to) => {
              const dragItem = active.lanes?.[from]!;
              const lanes = update(active.lanes, {
                $splice: [
                  [from, 1],
                  [to, 0, dragItem],
                ],
              });
              const copy = { ...active };
              copy.lanes = lanes;
              designerDispatch({
                type: "UPDATE",
                data: copy,
              });
            }}
          />
        ))}
      <Button
        type={"link"}
        onClick={() => {
          const copy = { ...active };
          copy.lanes!.push({ cellDataList: [], span: 50 });
          designerDispatch({
            type: "UPDATE",
            data: copy,
          });
        }}
      >
        添加列
      </Button>
    </>
  );
}
