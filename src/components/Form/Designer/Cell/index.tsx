import React, {
  CSSProperties,
  forwardRef,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  CellData,
  CellDataValueObject,
  CellProps as ActualCellProps,
  DispatchSetValueProps,
  LanedCellData,
  SwimlaneLocation,
  TabCellData,
} from "../../schema";
import { GridCell } from "./GridCell";
import { Interactions } from "../../hooks/interactions";
import { InteractionContext } from "../../util";
import { TabCell } from "./TabCell";
import { DesignerContext } from "../index";
import { TextAreaCell } from "./TextAreaCell";
import InputCell from "./InputCell";
import { SwitchCell } from "./SwitchCell";
import { LabelCell } from "./LabelCell/LabelCell";
import { DateCell } from "./DateCell";
import { SelectCell } from "./SelectCell";
import CheckboxCell from "./CheckboxCell";
import { SelectCellData } from "./SelectCell/schema";
import { InstanceContext } from "../../index";
import {NestedFormData} from "../../../schema";

export interface CustomCell {
  type: string;
  cell: FunctionComponent<ActualCellProps>;
  config?: FunctionComponent<{
    data: CellData;
    onChange: (data: CellData) => void;
  }>;
  icon?: JSX.Element;
  name?: string;
  createWidgetInstance?: () => CellData;
}
interface CellProps {
  cellData: CellData;
  layout?: "vertical" | "horizontal";
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  customCells?: CustomCell[];
  children?: JSX.Element;
  location?: SwimlaneLocation;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export const Cell = forwardRef(
  (
    {
      cellData,
      layout = "horizontal",
      style,
      onClick,
      className,
      customCells,
      children,
      location,
      onDoubleClick,
    }: CellProps,
    ref: any
  ) => {
    // todo: should prevent from remove required cell

    const instanceDispatch = useContext(InstanceContext);
    const designerDispatch = useContext(DesignerContext);
    const data = useMemo(
      (): CellData => ({
        required: false,
        warnable: false,
        layout: "default",
        labeled: true,
        ...cellData,
      }),
      [cellData]
    );
    const interactions = useContext<Interactions>(InteractionContext);
    const onChange = useCallback(
      (value: unknown, valueObject: CellDataValueObject | undefined) => {
        const targetId =
          location && layout === "vertical"
            ? `${location.parentId}.${location.index}.${data.id}`
            : data.id;
        const command: DispatchSetValueProps = {
          type: "SET_VALUE",
          targetId,
          value: value,
        };
        if (instanceDispatch) {
          instanceDispatch(command);
        } else {
          designerDispatch(command);
        }

        const unstagedValues: NestedFormData = {};
        data.onChange?.(
          value,
          {
            ...interactions,
            /**
             * Wrapper to replace the result of default getValue with unstaged values
             * @param id: e.g., name, details.0.name, details.name
             */
            getValue(id: string): unknown | unknown[] {
              unstagedValues[targetId] = value;
              for (const unstagedId in unstagedValues) {
                if (
                  !Object.prototype.hasOwnProperty.call(
                    unstagedValues,
                    unstagedId
                  )
                ) {
                  continue;
                }

                const unstagedValue = unstagedValues[unstagedId];

                if (id === unstagedId) {
                  return unstagedValue;
                }

                const unstagedIds = unstagedId.split(".");

                if (
                  unstagedIds.length === 3 &&
                  id === `${unstagedIds[0]}.${unstagedIds[2]}`
                ) {
                  const values = interactions.getValue(id);
                  // replace stage value with unstaged value
                  values.splice(parseInt(unstagedIds[1]), 1, unstagedValue);
                  return values;
                }
              }
              return interactions.getValue(id);
            },
            /**
             * Wrapper to save value to unstaged values
             * @param id: e.g., name, details.0.name, details.name
             * @param value: value of component
             */
            setValue(id: string, value: unknown): void {
              unstagedValues[id] = value;
              interactions.setValue(id, value);
            },
          },
          valueObject,
          location
        );
      },
      [data, designerDispatch, instanceDispatch, interactions, layout, location]
    );
    const props = useMemo(
      () => ({
        onChange,
        data,
        layout,
      }),
      [data, layout, onChange]
    );
    return (
      <>
        <div
          onDoubleClick={onDoubleClick}
          ref={ref}
          style={style}
          className={`instance relative ${
            !instanceDispatch && data.active ? " active " : " "
          }${className || ""}`}
          onClick={onClick}
        >
          {children}
          {data.type === "input" ? (
            <InputCell {...props} />
          ) : data.type === "textarea" ? (
            <TextAreaCell {...props} />
          ) : data.type === "grid" ? (
            <GridCell data={data as LanedCellData} customCells={customCells} />
          ) : data.type === "list" ? (
            <GridCell
              data={data as LanedCellData}
              direction={"vertical"}
              customCells={customCells}
            />
          ) : data.type === "select" ? (
            <SelectCell {...props} data={data as SelectCellData} />
          ) : data.type === "datetime" ? (
            <DateCell {...props} />
          ) : data.type === "checkbox" ? (
            <CheckboxCell {...props} />
          ) : data.type === "label" ? (
            <LabelCell {...props} />
          ) : data.type === "switch" ? (
            <SwitchCell {...props} />
          ) : data.type === "tab" ? (
            <TabCell
              {...props}
              data={data as TabCellData}
              customCells={customCells}
            />
          ) : (
            (customCells &&
              customCells.some((item) => item.type === data.type) &&
              React.createElement(
                customCells.filter((item) => item.type === data.type)[0].cell,
                props
              )) || (
              <>
                <span>{`Not found: ${data.type} of ${customCells
                  ?.map((item) => item.type)
                  .join(", ")}`}</span>
              </>
            )
          )}
        </div>
      </>
    );
  }
);
