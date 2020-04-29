import './index.css';
import React from 'react';

export const DynamicFormDesigner = function () {
    return <>
        <table className={'layout'}>
            <tr>
                <td className={'left'} rowSpan={2}></td>
                <td className={'toolbar'}></td>
                <td className={'right'} rowSpan={2}></td>
            </tr>
            <tr>
                <td className={'form'}></td>
            </tr>
        </table>
    </>;
}