import React, {
  Dispatch,
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
import { getActive, peek, reducer } from "./util";
import { CellData } from "./schemas/CellData";
import { WidgetGroups } from "../../constants/WidgetGroups";
import { DnDCell } from "./components/DnDCell";
import GridCellConfig from "./components/GridCellConfig";
import InputCellConfig from "./components/InputCellConfig";
import Form from "../Form";
import SwimlaneLocation from "./schemas/SwimlaneLocation";

const { Sider, Content, Header } = Layout;

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ span: 100, cellDataList: [] }],
  active: false,
};

interface DispatchNoobProps {
  type: "NOOB";
  position: "up" | "down";
  dragItem: CellData;
  dropItemId: string;
}

interface DispatchActiveProps {
  id: string;
  type: "ACTIVE";
}

interface DispatchEditProps {
  id: string;
  type: "EDIT";
}

interface DispatchMoveProps {
  type: "MOVE";
  dragItemId: string;
  position: "up" | "down";
  dropItemId: string;
}

interface DispatchFarmProps {
  type: "FARM";
  cellDataId: string;
  location: SwimlaneLocation;
}

interface DispatchAddProps {
  type: "ADD";
  cellData: CellData;
  location: SwimlaneLocation;
}

interface DispatchUpdateProps {
  type: "UPDATE";
  data: CellData;
}

export const DesignerContext = React.createContext<
  Dispatch<
    | DispatchMoveProps
    | DispatchNoobProps
    | DispatchActiveProps
    | DispatchEditProps
    | DispatchFarmProps
    | DispatchAddProps
    | DispatchUpdateProps
  >
>({} as Dispatch<any>);
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
                        <Button>Reset</Button>
                        <Button onClick={() => setPreviewDialogVisible(true)}>
                          Preview
                        </Button>
                        <Button>Save</Button>
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
                      <GridCellConfig data={active} />
                    ) : active.type === "input" ? (
                      <InputCellConfig data={active} />
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
        <Modal
          width={1000}
          title={"Preview"}
          visible={previewDialogVisible}
          onOk={() => setPreviewDialogVisible(false)}
          onCancel={() => setPreviewDialogVisible(false)}
        >
          <Form
            data={peek(data, function (item) {
              item.id += "p";
            })}
          />
        </Modal>
      </DesignerContext.Provider>
    </>
  );
};
