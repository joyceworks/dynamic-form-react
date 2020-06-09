import React, { Fragment } from "react";
import { WidgetData } from "../schemas/WidgetData";
import { Widget } from "./Widget";

interface WidgetGroupProps {
  name: string;
  list: WidgetData[];
}

export default function ({ name, list }: WidgetGroupProps) {
  return (
    <>
      <Fragment key={name}>
        <div>{name}</div>
        <ul
          className={"panel"}
          style={{
            width: "100%",
            listStyle: "none",
            padding: 0,
          }}
        >
          {list.map((w: WidgetData) => {
            return <Widget key={w.name} widget={w} />;
          })}
        </ul>
      </Fragment>
    </>
  );
}
