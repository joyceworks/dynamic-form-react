import React, {
  CSSProperties,
  Dispatch,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Button, Modal, Space } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { clone, cloneAndForEach, getActive, reducer } from "./util";
import { CellData } from "../schema";
import { WidgetGroups } from "../constants/WidgetGroups";
import { DnDCell } from "./DnDCell";
import GridCellConfig from "./Cell/GridCellConfig";
import styled from "styled-components";
import WidgetGroup from "./WidgetGroup";
import LabelCellConfig from "../../LabelCell/LabelCellConfig";
import { CustomCell } from "./Cell";
import { AiOutlineEdit } from "react-icons/all";
import { WhiteContent, WhiteHeader, WhiteLayout, WhiteSider } from "../Layout";
import DefaultCellConfig from "./DefaultCellConfig";
import { CellDataType, ReducerActionProps } from "../type";
import useInteractions from "../hooks/interactions";
import Form from "../index";
import { InteractContext } from "../util";
import TabCellConfig from "./Cell/TabCell/TabCellConfig";
import "./index.css";

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ span: 24, cellDataList: [] }],
  active: false,
};

export const DesignerContext = React.createContext<
  Dispatch<ReducerActionProps>
>({} as Dispatch<ReducerActionProps>);
const LeftSider = styled(WhiteSider).attrs({
  width: 280,
})`
  padding: 10px;
  border-right: 1px solid #d3d3d3;
  height: 100%;
  overflow-y: auto;
`;
const FullHeightBorderedLayout = styled(WhiteLayout)`
  border: 1px solid #d3d3d3;
  height: calc(100% - 1px);
`;
const ToolBar = styled(WhiteHeader)`
  padding: 0 10px;
  text-align: right;
  border-bottom: 1px solid #a3a3a3;
`;

interface DesignerProps {
  customCells?: CustomCell[];
  availableCustomCells?: CustomCell[];
  toolbar?: boolean;
  style?: CSSProperties;
  defaultCellData?: CellData;
  builtinCellDataTypes?: CellDataType[];
  onChange?: (root: CellData) => void;
}

export const Designer = forwardRef(
  (
    {
      customCells,
      availableCustomCells,
      toolbar = true,
      defaultCellData,
      builtinCellDataTypes,
      onChange,
      style,
    }: DesignerProps,
    ref
  ) => {
    const [data, designerDispatch] = useReducer(
      reducer,
      defaultCellData || rootCellData
    );
    const [previewDialogVisible, setPreviewDialogVisible] = useState(false);
    const [previewData, setPreviewData] = useState<CellData | null>(null);
    const previewRef = useRef<any>();
    const delFunction = useCallback((event) => {
      if (event.keyCode === 46 || (event.ctrlKey && event.keyCode === 8)) {
        designerDispatch({ type: "DELETE_ACTIVE" });
      }
    }, []);
    const finalAvailableCells = useMemo(() => {
      return availableCustomCells || customCells;
    }, [availableCustomCells, customCells]);
    useEffect(() => {
      document.addEventListener("keyup", delFunction, false);
      return () => document.removeEventListener("keyup", delFunction, false);
    }, [delFunction]);
    useEffect(() => onChange?.(data), [data, onChange]);
    useImperativeHandle(ref, () => ({
      preview() {
        setPreviewDialogVisible(true);
        setPreviewData(clone(data));
      },
      reset() {
        designerDispatch({
          type: "INIT",
          data: rootCellData,
        });
      },
      load(data: CellData) {
        designerDispatch({
          type: "INIT",
          data: data,
        });
      },
      get() {
        return cloneAndForEach(data, (item) => (item.value = undefined));
      },
    }));
    const active = getActive(data);
    const interactions = useInteractions(designerDispatch, data);
    const widgetGroups = useMemo(() => {
      if (!builtinCellDataTypes) {
        return WidgetGroups;
      }
      return WidgetGroups.map((group) => ({
        name: group.name,
        widgets: group.widgets.filter(
          (widget) =>
            builtinCellDataTypes.indexOf(widget.type as CellDataType) > -1
        ),
      })).filter((group) => group.widgets.length > 0);
    }, [builtinCellDataTypes]);

    return (
      <>
        <DesignerContext.Provider value={designerDispatch}>
          <InteractContext.Provider value={interactions}>
            <DndProvider backend={HTML5Backend}>
              <FullHeightBorderedLayout style={style}>
                <LeftSider>
                  {widgetGroups.map((g) => (
                    <WidgetGroup key={g.name} name={g.name} list={g.widgets} />
                  ))}
                  {finalAvailableCells && (
                    <WidgetGroup
                      key={"Custom"}
                      name={"Custom"}
                      list={[
                        ...finalAvailableCells.map((cell) => ({
                          type: cell.type,
                          name: cell.name || "Custom",
                          icon: cell.icon || <AiOutlineEdit />,
                        })),
                      ]}
                    />
                  )}
                </LeftSider>
                <WhiteContent>
                  <WhiteLayout style={{ height: "100%" }}>
                    {toolbar && (
                      <ToolBar>
                        <Space>
                          <Button
                            onClick={() => {
                              designerDispatch({
                                type: "INIT",
                                data: rootCellData,
                              });
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            onClick={() => {
                              setPreviewDialogVisible(true);
                              setPreviewData(clone(data));
                            }}
                          >
                            Preview
                          </Button>
                          <Button onClick={() => alert(JSON.stringify(data))}>
                            Save
                          </Button>
                        </Space>
                      </ToolBar>
                    )}

                    <WhiteContent style={{ height: "100%", padding: 10 }}>
                      <DnDCell
                        className={"root"}
                        cellData={data}
                        index={0}
                        customCells={customCells}
                      />
                    </WhiteContent>
                  </WhiteLayout>
                </WhiteContent>
                <WhiteSider
                  width={280}
                  style={{
                    padding: 10,
                    borderLeft: "1px solid #d3d3d3",
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  {active ? (
                    active.type === "grid" ? (
                      <GridCellConfig data={active} />
                    ) : active.type === "tab" ? (
                      <TabCellConfig data={active} />
                    ) : active.type === "label" ? (
                      <LabelCellConfig data={active} />
                    ) : (
                      (customCells &&
                        customCells.some((item) => item.type === active.type) &&
                        customCells.filter(
                          (item) => item.type === active.type
                        )[0].config &&
                        React.createElement(
                          customCells.filter(
                            (item) => item.type === active.type
                          )[0].config!,
                          {
                            data: active,
                            onChange: function (data: CellData) {
                              designerDispatch({
                                type: "UPDATE",
                                data: data,
                              });
                            },
                          }
                        )) || <DefaultCellConfig data={active} />
                    )
                  ) : (
                    <></>
                  )}
                </WhiteSider>
              </FullHeightBorderedLayout>
            </DndProvider>
          </InteractContext.Provider>
        </DesignerContext.Provider>
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
              customCells={customCells}
              ref={previewRef}
              data={cloneAndForEach(previewData, (data) => {
                data.value = data.defaultValue || data.value;
              })}
              key={previewData.id}
            />
          )}
        </Modal>
      </>
    );
  }
);
