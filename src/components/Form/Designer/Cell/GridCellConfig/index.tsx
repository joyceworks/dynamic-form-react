import React, { useContext } from "react";
import LaneConfig from "./LaneConfig";
import update from "immutability-helper";
import { Button, Form } from "antd";
import { DesignerContext } from "../../index";
import { labelCol } from "../../constant";
import { LanedCellData } from "../../../schema";

export default function GridCellConfig({
  data,
}: {
  data: LanedCellData;
}): JSX.Element {
  const designerDispatch = useContext(DesignerContext);
  return (
    <Form labelCol={labelCol}>
      <Form.Item label={"Column"}>
        <>
          {data &&
            data.lanes &&
            data.lanes.map((lane, index) => (
              <LaneConfig
                key={index}
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
                  const dragItem = data.lanes[from];
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
              const copy: LanedCellData = { ...data };
              copy.lanes.push({ cellDataList: [], span: 12 });
              designerDispatch({
                type: "UPDATE",
                data: copy,
              });
            }}
          >
            Add
          </Button>
        </>
      </Form.Item>
    </Form>
  );
}
