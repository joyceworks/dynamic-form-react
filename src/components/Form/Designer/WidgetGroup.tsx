import React, { Fragment } from "react";
import { Widget } from "./Widget";
import { WidgetData } from "../schema";
import { Space, Typography } from "antd";

interface WidgetGroupProps {
  name: string;
  list: WidgetData[];
  header?: boolean;
}

export default function ({
  name,
  list,
  header = true,
}: WidgetGroupProps): JSX.Element {
  return (
    <>
      <Fragment key={name}>
        {header ? <Typography.Text>{name}</Typography.Text> : <></>}
        <Space direction={"vertical"} className={"w-full"}>
          {list.map((w) => (
            <Widget key={w.name} widget={w} />
          ))}
        </Space>
      </Fragment>
    </>
  );
}
