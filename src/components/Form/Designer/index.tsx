import React, {
  CSSProperties,
  Dispatch,
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Button, Modal, Space, Typography } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { clone, cloneAndForEach, getActive, reducer } from "./util";
import {
  CellData,
  CellDataType,
  LanedCellData,
  ReducerActionProps,
  TabCellData,
} from "../schema";
import { WidgetGroups } from "../constant";
import { DnDCell } from "./DnDCell";
import GridCellConfig from "./Cell/GridCellConfig";
import styled from "styled-components";
import WidgetGroup from "./WidgetGroup";
import LabelCellConfig from "./Cell/LabelCell/LabelCellConfig";
import { CustomCell } from "./Cell";
import {
  WhiteContent,
  WhiteHeader,
  WhiteLayout,
  WhiteSider,
} from "../component";
import DefaultCellConfig from "./DefaultCellConfig";
import useInteractions from "../hooks/interactions";
import { InteractionContext } from "../util";
import TabCellConfig from "./Cell/TabCell/TabCellConfig";
import "./index.css";
import CheckboxCellConfig from "./Cell/CheckboxCell/CheckboxCellConfig";
import SelectCellConfig from "./Cell/SelectCell/SelectCellConfig";
import DateCellConfig from "./Cell/DateCell/DateCellConfig";
import { contentStyle, rightSiderStyle } from "./style";
import InputCellConfig from "./Cell/InputCell/InputCellConfig";
import { InputCellData } from "./Cell/InputCell/schema";
import { SelectCellData } from "./Cell/SelectCell/schema";
import Form from "../index";

const rootCellData: CellData = {
  type: "grid",
  id: "11270307",
  lanes: [{ cellDataList: [] }],
  active: false,
};

export const DesignerContext = React.createContext<
  Dispatch<ReducerActionProps>
>({} as Dispatch<ReducerActionProps>);
const LeftSider = styled(WhiteSider).attrs({
  width: 160,
})`
  padding: 10px;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
`;
const FullHeightBorderedLayout = styled(WhiteLayout)`
  border: 1px solid #f0f0f0;
  height: calc(100% - 1px);
`;
const ToolBar = styled(WhiteHeader)`
  padding: 0 10px;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
`;

export interface IEntityFormDesigner {
  get: () => CellData;
}

interface DesignerProps {
  customCells?:
    | CustomCell[]
    | {
        [key: string]: CustomCell[];
      };
  availableCustomCells?: CustomCell[];
  toolbar?: boolean;
  property?: boolean;
  style?: CSSProperties;
  defaultCellData?: CellData;
  builtinCellDataTypes?: CellDataType[];
  onChange?: (root: CellData) => void;
  className?: string;
  title?: string;
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
      property = true,
      className,
      title,
    }: DesignerProps,
    ref: Ref<IEntityFormDesigner>
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
      load(cellDataList: CellData[]) {
        designerDispatch({
          type: "INIT",
          data: {
            type: "grid",
            id: "03071128",
            lanes: [{ cellDataList }],
            active: false,
          },
        });
      },
      get() {
        return cloneAndForEach(data, (item) => {
          item.value = undefined;
          item.active = false;
        });
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

    const flattedCustomCells: CustomCell[] = useMemo(() => {
      return customCells
        ? Array.isArray(customCells)
          ? customCells
          : Object.keys(customCells)
              .map((key) => customCells[key])
              .flat()
        : [];
    }, [customCells]);

    return (
      <>
        <DesignerContext.Provider value={designerDispatch}>
          <InteractionContext.Provider value={interactions}>
            <DndProvider backend={HTML5Backend}>
              <FullHeightBorderedLayout className={className} style={style}>
                <LeftSider>
                  {title && (
                    <Typography.Title level={5}>{title}</Typography.Title>
                  )}
                  {widgetGroups.map((g) => (
                    <WidgetGroup key={g.name} name={g.name} list={g.widgets} />
                  ))}
                  {customCells &&
                    (Array.isArray(customCells) ? (
                      <WidgetGroup
                        header={!!widgetGroups.length}
                        key={"Custom"}
                        name={"Custom"}
                        list={[
                          ...customCells.map((cell) => {
                            return {
                              type: cell.type,
                              name: cell.name || "Custom",
                              icon: cell.icon,
                              createWidgetInstance: cell.createWidgetInstance,
                            };
                          }),
                        ]}
                      />
                    ) : (
                      Object.keys(customCells).map((key) => (
                        <WidgetGroup
                          header={!!widgetGroups.length}
                          key={key}
                          name={key}
                          list={[
                            ...customCells[key].map((cell) => {
                              return {
                                type: cell.type,
                                name: cell.name || "Custom",
                                icon: cell.icon,
                                createWidgetInstance: cell.createWidgetInstance,
                              };
                            }),
                          ]}
                        />
                      ))
                    ))}
                </LeftSider>
                <WhiteContent>
                  <WhiteLayout className="h-full">
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

                    <WhiteContent style={contentStyle}>
                      <DnDCell
                        className={"root"}
                        cellData={data}
                        index={0}
                        customCells={flattedCustomCells}
                      />
                    </WhiteContent>
                  </WhiteLayout>
                </WhiteContent>
                {property && (
                  <WhiteSider width={280} style={rightSiderStyle}>
                    {active ? (
                      active.type === "grid" ? (
                        <GridCellConfig data={active as LanedCellData} />
                      ) : active.type === "tab" ? (
                        <TabCellConfig data={active as TabCellData} />
                      ) : active.type === "datetime" ? (
                        <DateCellConfig data={active} />
                      ) : active.type === "select" ? (
                        <SelectCellConfig data={active as SelectCellData} />
                      ) : active.type === "checkbox" ? (
                        <CheckboxCellConfig data={active as SelectCellData} />
                      ) : active.type === "label" ? (
                        <LabelCellConfig data={active} />
                      ) : active.type === "input" ? (
                        <InputCellConfig data={active as InputCellData} />
                      ) : (
                        (customCells &&
                          flattedCustomCells.some(
                            (item) => item.type === active.type
                          ) &&
                          flattedCustomCells.filter(
                            (item) => item.type === active.type
                          )[0].config &&
                          React.createElement(
                            flattedCustomCells.filter(
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
                )}
              </FullHeightBorderedLayout>
            </DndProvider>
          </InteractionContext.Provider>
        </DesignerContext.Provider>
        <Modal
          width={1000}
          title={"Preview"}
          visible={previewDialogVisible}
          onCancel={() => setPreviewDialogVisible(false)}
          footer={[
            <Button
              key={"save"}
              onClick={() => {
                const result = previewRef.current!.getData();
                alert(JSON.stringify(result));
              }}
            >
              Save
            </Button>,
            <Button
              key={"validate"}
              onClick={() => previewRef.current.validate()}
            >
              Validate
            </Button>,
          ]}
        >
          {previewData && (
            <Form
              customCells={flattedCustomCells}
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
