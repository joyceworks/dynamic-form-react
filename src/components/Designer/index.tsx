import React, {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Layout, Button, Space, Modal } from "antd";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { WidgetData } from "./schemas/WidgetData";
import "./index.css";
import { Widget } from "./components/Widget";
import { getActive, reducer } from "./util";
import { CellData } from "./schemas/CellData";
import { WidgetGroups } from "../../constants/WidgetGroups";
import { DnDCell } from "./components/DnDCell";
import { Cell } from "./components/Cell";
import LaneConfig from "./components/LaneConfig";

const { Sider, Content, Header } = Layout;

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ span: 100, cellDataList: [] }],
  active: false,
};

export const DesignerContext = React.createContext<any>(null);
export const PreviewContext = React.createContext<any>(null);
export const Designer = function () {
  const [data, designerDispatch] = useReducer(reducer, rootCellData);
  const [previewDialogVisible, setPreviewDialogVisible] = useState(false);
  const delFunction = useCallback((event) => {
    if (event.keyCode === 46) {
      designerDispatch({
        type: "DELETE_ACTIVE",
      });
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keyup", delFunction, false);
    return () => {
      document.removeEventListener("keyup", delFunction, false);
    };
  }, [delFunction]);
  const active = getActive(data);

  return (
    <>
      <DesignerContext.Provider value={designerDispatch}>
        <DndProvider backend={Backend}>
          <Layout className={"layout"}>
            <Sider width={280} className={"left"}>
              {WidgetGroups.map((g) => (
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
                <Header style={{ padding: 0, textAlign: "right" }}>
                  <Space>
                    <Button>清空</Button>
                    <Button onClick={() => setPreviewDialogVisible(true)}>
                      预览
                    </Button>
                    <Button>保存</Button>
                  </Space>
                </Header>
                <Content className={"form"} style={{ height: "100%" }}>
                  <DnDCell cellData={data} index={0} />
                </Content>
              </Layout>
            </Content>
            <Sider width={280} className={"right"}>
              {active ? (
                active.type === "grid" ? (
                  <>
                    列配置项
                    {active &&
                      active.lanes &&
                      active.lanes.map((lane, index) => (
                        <LaneConfig
                          key={"lane-config-" + index}
                          index={index}
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
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </Sider>
          </Layout>
        </DndProvider>
      </DesignerContext.Provider>
      <Modal
        title={"Preview"}
        visible={previewDialogVisible}
        onOk={() => setPreviewDialogVisible(false)}
        onCancel={() => setPreviewDialogVisible(false)}
      >
        <PreviewContext.Provider value={true}>
          <Cell cellData={data} />
        </PreviewContext.Provider>
      </Modal>
    </>
  );
};
