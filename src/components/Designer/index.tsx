import React, {
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Layout, Button, Space, Modal } from "antd";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import "./index.css";
import { getActive, cloneAndForEach, reducer } from "./util";
import { CellData } from "./schemas/CellData";
import { WidgetGroups } from "../../constants/WidgetGroups";
import { DnDCell } from "./components/DnDCell";
import GridCellConfig from "./components/GridCellConfig";
import InputCellConfig from "./components/InputCellConfig";
import Form from "../Instance";
import {
  DispatchActiveProps,
  DispatchAddProps,
  DispatchDeleteActiveProps,
  DispatchEditProps,
  DispatchMoveProps,
  DispatchPositionedAddProps,
  DispatchPositionedMove,
  DispatchSetValueProps,
  DispatchUpdateProps,
  DispatchValidateProps,
} from "./schemas/ReducerAction";
import styled from "styled-components";
import DateCellConfig from "./components/DateCellConfig";
import SelectCellConfig from "./components/SelectCellConfig";
import WidgetGroup from "./components/WidgetGroup";

const { Sider, Content, Header } = Layout;

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ span: 24, cellDataList: [] }],
  active: false,
};

const RootCell = styled(DnDCell)`
  height: 100%;
  &:after {
    content: "Drag to drop";
    font-size: 32px;
    color: #d3d3d3;
    left: calc(50% - 85px);
    top: calc(50% - 25px);
    position: absolute;
    display: ${(props) =>
      props.cellData.lanes![0].cellDataList.length === 0 ? "block" : "none"};
  }

  > .lanes {
    height: 100%;
  }
`;

export const DesignerContext = React.createContext<
  Dispatch<
    | DispatchPositionedMove
    | DispatchPositionedAddProps
    | DispatchActiveProps
    | DispatchEditProps
    | DispatchMoveProps
    | DispatchAddProps
    | DispatchUpdateProps
    | DispatchDeleteActiveProps
    | DispatchSetValueProps
    | DispatchValidateProps
  >
>({} as Dispatch<any>);
const LeftSider = styled(Sider).attrs({
  width: 280,
})`
  padding: 10px;
  border-right: 1px solid #d3d3d3;
`;
const RightSider = styled(Sider).attrs({
  width: 280,
})`
  padding: 10px;
  border-left: 1px solid #d3d3d3;
`;
const ToolBar = styled(Header)`
  padding: 0 10px;
  text-align: right;
  border-bottom: 1px solid #a3a3a3;
`;
export const Designer = function () {
  const [data, designerDispatch] = useReducer(reducer, rootCellData);
  const [previewDialogVisible, setPreviewDialogVisible] = useState(false);
  const [previewData, setPreviewData] = useState<CellData | null>(null);
  const previewRef = useRef<any>();
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
                <LeftSider>
                  {WidgetGroups.map((g) => (
                    <WidgetGroup key={g.name} name={g.name} list={g.widgets} />
                  ))}
                </LeftSider>
                <Content>
                  <Layout style={{ height: "100%" }}>
                    <ToolBar>
                      <Space>
                        <Button>Reset</Button>
                        <Button
                          onClick={() => {
                            setPreviewDialogVisible(true);
                            setPreviewData(
                              cloneAndForEach(data, function (item) {
                                item.id += +new Date();
                              })
                            );
                          }}
                        >
                          Preview
                        </Button>
                        <Button>Save</Button>
                      </Space>
                    </ToolBar>
                    <Content style={{ height: "100%", padding: 10 }}>
                      <RootCell cellData={data} index={0} />
                    </Content>
                  </Layout>
                </Content>
                <RightSider>
                  {active ? (
                    active.type === "grid" ? (
                      <GridCellConfig data={active} />
                    ) : active.type === "input" ? (
                      <InputCellConfig data={active} />
                    ) : active.type === "datetime" ? (
                      <DateCellConfig data={active} />
                    ) : active.type === "select" ? (
                      <SelectCellConfig data={active} />
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                </RightSider>
              </Layout>
            </Content>
          </Layout>
        </DndProvider>
        <Modal
          width={1000}
          title={"Preview"}
          visible={previewDialogVisible}
          onCancel={() => setPreviewDialogVisible(false)}
          footer={[
            <Button
              onClick={() => {
                const result = previewRef.current!.getData();
                alert(JSON.stringify(result));
              }}
            >
              Save
            </Button>,
            <Button onClick={() => previewRef.current.validate()}>
              Validate
            </Button>,
          ]}
        >
          {previewData && (
            <Form
              ref={previewRef}
              data={cloneAndForEach(previewData, (data) => {
                data.value = data.defaultValue || data.value;
              })}
              key={previewData.id}
            />
          )}
        </Modal>
      </DesignerContext.Provider>
    </>
  );
};
