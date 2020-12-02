import React, { useContext } from "react";
import LaneConfig from "./LaneConfig";
import update from "immutability-helper";
import { Button, Form } from "antd";
import { CellData } from "../../../schema";
import { DesignerContext } from "../../index";

interface GridCellConfigProps {
  data: CellData;
}

export default function GridCellConfig({ data }: GridCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <Form labelCol={{ span: 8 }}>
      <Form.Item label={"列"}>
        <>
          {data &&
            data.lanes &&
            data.lanes.map((lane, index) => (
              <LaneConfig
                key={"lane-config-" + index}
                index={index}
                data={lane}
                onResize={(span) => {
                  const finalSpan =
                    typeof span === "string" || !span ? 0 : span;
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      lanes: update(data.lanes, {
                        [index]: {
                          span: { $set: finalSpan },
                        },
                      }),
                    },
                  });
                }}
                onRemove={() => {
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      lanes: update(data.lanes, {
                        $splice: [[index, 1]],
                      }),
                    },
                  });
                }}
                move={(from, to) => {
                  const dragItem = data.lanes?.[from]!;
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      lanes: update(data.lanes, {
                        $splice: [
                          [from, 1],
                          [to, 0, dragItem],
                        ],
                      }),
                    },
                  });
                }}
              />
            ))}
          <Button
            type={"link"}
            onClick={() => {
              const copy = { ...data };
              copy.lanes!.push({ cellDataList: [], span: 12 });
              designerDispatch({
                type: "UPDATE",
                data: copy,
              });
            }}
          >
            添加列
          </Button>
        </>
      </Form.Item>
    </Form>
  );
}
