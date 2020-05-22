import React, {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Layout, Button, Space, Modal } from "antd";
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
import GridCellConfig from "./components/GridCellConfig";

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
          <Layout style={{ height: "100%" }}>
            <Header style={{ padding: "0 20px" }}>
              <h1>Dynamic Form Designer</h1>
            </Header>
            <Content>
              <Layout
                className={"layout"}
                style={{ borderTop: "1px solid #a3a3a3" }}
              >
                <Sider
                  width={280}
                  className={"left"}
                  style={{ borderRight: "1px solid #a3a3a3" }}
                >
                  {WidgetGroups.map((g) => (
                    <Fragment key={g.name}>
                      <div>{g.name}</div>
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
                    <Header
                      style={{
                        padding: "0 10px",
                        textAlign: "right",
                        borderBottom: "1px solid #a3a3a3",
                      }}
                    >
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
                <Sider
                  width={280}
                  className={"right"}
                  style={{ borderLeft: "1px solid #a3a3a3" }}
                >
                  {active ? (
                    active.type === "grid" ? (
                      <GridCellConfig active={active} />
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                </Sider>
              </Layout>
            </Content>
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
