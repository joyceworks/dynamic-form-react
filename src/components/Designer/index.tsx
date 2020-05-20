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

const { Sider, Content, Header } = Layout;

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ span: 100, cellDataList: [] }],
  active: false,
};

export const DesignerContext = React.createContext<any>(null);

export const Designer = function () {
  const [data, dispatch] = useReducer(reducer, rootCellData);
  const [previewDialogVisible, setPreviewDialogVisible] = useState(false);
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
  }, [delFunction]);

  return (
    <>
      <DesignerContext.Provider value={dispatch}>
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
              {getActive(data)?.id}
            </Sider>
          </Layout>
        </DndProvider>
      </DesignerContext.Provider>
      <Modal title={"Preview"} visible={previewDialogVisible}>
        <Cell cellData={data} />
      </Modal>
    </>
  );
};
