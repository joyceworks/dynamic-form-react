import React, { forwardRef, useContext } from "react";
import "./index.css";
import { InstanceContext } from "../../../Instance";

interface FormGroupProps {
  layout?: "inline" | "default";
  required: boolean;
  warning?: string | null;
  warnable: boolean;
  label: JSX.Element | null;
  element: JSX.Element | null;
}

export const FormGroup = forwardRef(
  (
    {
      layout = "default",
      required = false,
      warning = null,
      warnable = true,
      label,
      element,
    }: FormGroupProps,
    ref: any
  ) => {
    const previewContext = useContext(InstanceContext);
    return (
      <table ref={ref} className={["form-group", layout].join(" ")}>
        <tbody>
          {layout === "default" ? (
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
              {!previewContext && (
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
