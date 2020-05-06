import React from "react";
import './index.css';

interface FormGroupProps {
    layout: 'inline' | 'default';
    required: boolean;
    warning: string | null;
    warningable: boolean;
    label: JSX.Element | null;
    element: JSX.Element;
}

export const FormGroup = function ({
                                       layout = 'default', required = false, warning = null,
                                       warningable = true, label, element
                                   }: FormGroupProps) {
    return <table className={['form-group', layout].join(' ')}>
        {
            layout === 'default' ? <>
                <tr>
                    <td className={'label'}>
                        {
                            required ? <span className={'required'}>*</span> : <></>
                        }
                        {label}
                    </td>
                    <td>
                        {element}
                    </td>
                </tr>
                {
                    warningable ? <tr>
                        <td/>
                        <td className={'warning'}>
                            {warning ? <span>{warning}</span> : <span>&nbsp;</span>}
                        </td>
                    </tr> : <></>
                }
            </> : <>
                <tr>
                    <td className={'label'}>
                        {
                            required ? <span className={'required'}>*</span> : <></>
                        }
                        {label}
                    </td>
                </tr>
                <tr>
                    <td>
                        {element}
                    </td>
                </tr>
                {
                    warningable ? <tr>
                        <td className={'warning'}>
                            {warning ? <span>{warning}</span> : <span>&nbsp;</span>}
                        </td>
                    </tr> : <></>
                }
            </>
        }
    </table>;
}