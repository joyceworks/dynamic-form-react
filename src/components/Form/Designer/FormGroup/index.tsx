import React, { forwardRef, useContext } from "react";
import "./index.css";
import { InstanceContext } from "../../index";

interface FormGroupProps {
  layout?: "vertical" | "horizontal";
  required?: boolean;
  warning?: string | null;
  warnable?: boolean;
  label?: JSX.Element | null;
  element: JSX.Element | null;
}

export const FormGroup = forwardRef(
  (
    {
      layout = "horizontal",
      required = false,
      warning = null,
      warnable = true,
      label = <></>,
      element,
    }: FormGroupProps,
    ref: any
  ) => {
    const instanceDispatch = useContext(InstanceContext);
    return (
      <table ref={ref} className={["form-group", layout].join(" ")}>
        <tbody>
          {layout === "horizontal" ? (
            <>
              <tr>
                <td className={"label"}>
                  {required ? <span className={"required"}>*</span> : <></>}
                  {label}
                </td>
                <td className={"element"}>{element}</td>
              </tr>
              {warnable ? (
                <tr>
                  <td />
                  <td className={"warning"}>
                    {warning ? <span>{warning}</span> : <span>&nbsp;</span>}
                  </td>
                </tr>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {!instanceDispatch && (
                <tr>
                  <td className={"label"}>
                    {required ? <span className={"required"}>*</span> : <></>}
                    {label}
                  </td>
                </tr>
              )}
              <tr>
                <td className={"element"}>{element}</td>
              </tr>
              {warnable ? (
                <tr>
                  <td className={"warning"}>
                    {warning ? <span>{warning}</span> : <span>&nbsp;</span>}
                  </td>
                </tr>
              ) : (
                <></>
              )}
            </>
          )}
        </tbody>
      </table>
    );
  }
);
