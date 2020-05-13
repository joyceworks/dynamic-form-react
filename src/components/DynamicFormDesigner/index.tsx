import React, { Fragment, useCallback, useEffect, useReducer } from "react";
import { Layout, Button, Space } from "antd";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import {
  AiOutlineCalendar,
  AiOutlineCheckSquare,
  AiOutlineCopy,
  AiOutlineDownSquare,
  AiOutlineEdit,
  AiOutlineMinus,
  AiOutlineOrderedList,
  AiOutlineTable,
} from "react-icons/ai";
import { WidgetData } from "./schemas/WidgetData";
import "./index.css";
import { Widget } from "./components/Widget";
import { reducer } from "./util";
import { CellData } from "./schemas/CellData";
import { Cell } from "./components/DynamicForm/components/Swimlane/components/Cell";

const { Sider, Content, Header } = Layout;

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  swimlanes: [{ span: 100, cellDataList: [] }],
  active: false,
};

const widgetGroup: { name: string; widgets: WidgetData[] }[] = [
  {
    name: "基础字段",
    widgets: [
      {
        type: "input",
        icon: <AiOutlineEdit />,
        name: "单行文本",
        enable: true,
      },
      {
        type: "textarea",
        icon: <AiOutlineEdit />,
        name: "多行文本",
        enable: true,
      },
      {
        type: "dropdown",
        icon: <AiOutlineDownSquare />,
        name: "下拉选择",
        enable: true,
      },
      {
        type: "datetime",
        icon: <AiOutlineCalendar />,
        name: "日期时间",
        enable: true,
      },
      {
        type: "tree",
        icon: <AiOutlineDownSquare />,
        name: "级联选择",
        enable: false,
      },
      {
        type: "checkbox",
        icon: <AiOutlineCheckSquare />,
        name: "多选",
        enable: true,
      },
      {
        type: "checkbox",
        icon: <AiOutlineCheckSquare />,
        name: "单选",
        enable: true,
      },
    ],
  },
  {
    name: "高级字段",
    widgets: [
      { type: "grid", icon: <AiOutlineTable />, name: "布局", enable: true },
      {
        type: "list",
        icon: <AiOutlineOrderedList />,
        name: "列表",
        enable: true,
      },
      {
        type: "separator",
        icon: <AiOutlineMinus />,
        name: "分割线",
        enable: false,
      },
      { type: "tab", icon: <AiOutlineCopy />, name: "标签页", enable: false },
    ],
  },
];

export const DynamicFormDesignerContext = React.createContext<any>(null);

export const DynamicFormDesigner = function () {
  const [data, dispatch] = useReducer(reducer, rootCellData);
  const delFunction = useCallback((event) => {
    if (event.keyCode === 46) {
      dispatch({
        type: "DELETE_ACTIVE",
      });
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keyup", delFunction, false);
    return () => {
      document.removeEventListener("keyup", delFunction, false);
    };
  }, []);

  return (
    <>
      <DynamicFormDesignerContext.Provider value={dispatch}>
        <DndProvider backend={Backend}>
          <Layout className={"layout"}>
            <Sider width={280} className={"left"}>
              {widgetGroup.map((g) => (
                <Fragment key={g.name}>
                  <div style={{ color: "white" }}>{g.name}</div>
                  <ul className={"panel"}>
                    {g.widgets.map((w: WidgetData) => {
                      return <Widget key={w.name} widget={w} />;
                    })}
                  </ul>
                </Fragment>
              ))}
            </Sider>
            <Content>
              <Layout style={{ height: "100%" }}>
                <Header className={"toolbar"}>
                  <Space>
                    <Button>清空</Button>
                    <Button>预览</Button>
                    <Button>保存</Button>
                  </Space>
                </Header>
                <Content className={"form"} style={{ height: "100%" }}>
                  <Cell cellData={data} index={0} />
                </Content>
              </Layout>
            </Content>
            <Sider width={280} className={"right"} />
          </Layout>
        </DndProvider>
      </DynamicFormDesignerContext.Provider>
    </>
  );
};
