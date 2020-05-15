import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { Cell } from "../../../Cell";
import { CellData } from "../../../../schemas/CellData";
import { DesignerContext } from "../../../../index";
import SwimlaneLocation from "../../../../schemas/SwimlaneLocation";

interface SwimlaneProps {
  cellDataList: CellData[];
  direction: "column" | "row";
  location: SwimlaneLocation;
}

function createWidgetInstance(widgetType: string) {
  let cellData: CellData = {
    type: widgetType,
    id: widgetType + new Date().getTime(),
    active: false,
  };
  if (cellData.type === "grid") {
    cellData.swimlanes = [
      { span: 50, cellDataList: [] },
      { span: 50, cellDataList: [] },
    ];
  } else if (cellData.type === "input") {
    cellData.label = "单行文本";
    cellData.placeholder = "请填写";
    cellData.required = false;
  } else if (cellData.type === "textarea") {
    cellData.label = "多行文本";
    cellData.placeholder = "请填写";
    cellData.required = false;
  } else if (cellData.type === "select") {
    cellData.label = "下拉选择";
    cellData.placeholder = "请选择";
    cellData.options = [];
    cellData.required = false;
  } else if (cellData.type === "list") {
    cellData.label = "列表";
    cellData.swimlanes = [{ cellDataList: [], span: 100 }];
  } else if (cellData.type === "datetime") {
    cellData.label = "日期时间";
    cellData.placeholder = "请选择";
    cellData.required = false;
  } else if (cellData.type === "checkbox") {
    cellData.label = "多选";
    cellData.options = [];
    cellData.required = false;
  } else if (cellData.type === "radio") {
    cellData.label = "单选";
    cellData.options = [];
    cellData.required = false;
  }
  return cellData;
}

export const Swimlane = function ({
  cellDataList,
  direction,
  location,
}: SwimlaneProps) {
  const dispatch = useContext(DesignerContext);
  const [{ isOver }, drop] = useDrop({
    accept: ["input", "grid", "select", "instance"],
    drop: (item: any, monitor) => {
      if (isOver) {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return;
        }

        dispatch({
          type: "ADD",
          cellData: createWidgetInstance(item.type as string),
          location: Object.assign({}, location, {
            index: cellDataList.length,
          }),
        });
      }
    },
    collect: (monitor) => {
      let isOver = monitor.isOver({ shallow: true });
      if (isOver && monitor.getItem().id === location.parentId) {
        isOver = false;
      }
      return { isOver: isOver };
    },
  });

  const layout = direction === "column" ? "default" : "inline";
  const cells = cellDataList.map((child, index) => (
    <Cell key={child.id} layout={layout} cellData={child} index={index} />
  ));

  return (
    <td
      className={"swimlane " + direction + (isOver ? " hovered" : "")}
      ref={drop}
    >
      {cells}
    </td>
  );
};
