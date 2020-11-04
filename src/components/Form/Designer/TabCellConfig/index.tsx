import React, { useContext } from "react";
import TabConfig from "./TabConfig";
import update from "immutability-helper";
import { Button, Form } from "antd";
import { CellData } from "../../schema";
import { DesignerContext } from "../index";

interface TabCellConfigProps {
  data: CellData;
}

export default function TabCellConfig({ data }: TabCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <Form labelCol={{ span: 6 }}>
      <Form.Item label={"选项卡"}>
        <>
          {data &&
            data.tabs &&
            data.tabs.map((tab, index) => (
              <TabConfig
                key={"tab-config-" + index}
                index={index}
                name={tab}
                onRename={(name) => {
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      tabs: update(data.tabs, {
                        [index]: { $set: name },
                      }),
                    },
                  });
                }}
                onRemove={() => {
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      tabs: update(data.tabs, {
                        $splice: [[index, 1]],
                      }),
                      lanes: update(data.lanes, {
                        $splice: [[index, 1]],
                      }),
                    },
                  });
                }}
                move={(from, to) => {
                  const dragItem = data.tabs![from]!;
                  designerDispatch({
                    type: "UPDATE",
                    data: {
                      ...data,
                      tabs: update(data.tabs, {
                        $splice: [
                          [from, 1],
                          [to, 0, dragItem],
                        ],
                      }),
                      lanes: update(data.lanes, {
                        $splice: [
                          [from, 1],
                          [to, 0, data.lanes![from]],
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
              copy.lanes!.push({ cellDataList: [], span: 0 });
              copy.tabs?.push("新选项卡");
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
