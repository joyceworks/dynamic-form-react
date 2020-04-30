import './index.css';
import React, {useState} from 'react';
import {Widget} from "./schemas";
import {
    AiOutlineCalendar,
    AiOutlineCheckSquare, AiOutlineCopy, AiOutlineDelete,
    AiOutlineDownSquare,
    AiOutlineEdit, AiOutlineEye, AiOutlineMinus,
    AiOutlineOrderedList, AiOutlineSave, AiOutlineSplitCells,
    AiOutlineTable
} from "react-icons/ai";


export const DynamicFormDesigner = function () {
    const [basicWidgets] = useState<Widget[]>([
        {type: 'input', icon: <AiOutlineEdit/>, name: '单行文本', enable: true},
        {type: 'textarea', icon: <AiOutlineEdit/>, name: '多行文本', enable: true},
        {type: 'dropdown', icon: <AiOutlineDownSquare/>, name: '下拉选择', enable: true},
        {type: 'datetime', icon: <AiOutlineCalendar/>, name: '日期时间', enable: true},
        {type: 'tree', icon: <AiOutlineDownSquare/>, name: '级联选择', enable: false},
        {type: 'checkbox', icon: <AiOutlineCheckSquare/>, name: '多选', enable: true},
        {type: 'checkbox', icon: <AiOutlineCheckSquare/>, name: '单选', enable: true},
    ]);

    const [advancedWidgets] = useState<Widget[]>([
        {type: 'grid', icon: <AiOutlineTable/>, name: '布局', enable: true},
        {type: 'list', icon: <AiOutlineOrderedList/>, name: '列表', enable: true},
        {type: 'separator', icon: <AiOutlineMinus/>, name: '分割线', enable: false},
        {type: 'tab', icon: <AiOutlineCopy/>, name: '标签页', enable: false},
    ]);

    return <>
        <table className={'layout'}>
            <tr>
                <td className={'left'} rowSpan={2}>
                    <div>基础字段</div>
                    <ul className={'panel'}>
                        {
                            basicWidgets.map(widget => <li className={'widget'}>
                                {widget.icon}
                                <span>{widget.name}</span>
                            </li>)
                        }
                    </ul>
                    <div>高级字段</div>
                    <ul className={'panel'}>
                        {
                            advancedWidgets.map(widget => <li className={'widget'}>
                                {widget.icon}
                                <span>{widget.name}</span>
                            </li>)
                        }
                    </ul>
                    <div id={"draggable"}></div>
                </td>
                <td className={'toolbar'}>
                    <button type={'button'} className={'btn'}>
                        <AiOutlineDelete/>
                        <span>
                            清空
                        </span>
                    </button>
                    <button type={'button'} className={'btn'}>
                        <AiOutlineEye/>
                        <span>预览</span>
                    </button>
                    <button type={'button'} className={'btn'}>
                        <AiOutlineSave/>
                        <span>保存</span>
                    </button>
                </td>
                <td className={'right'} rowSpan={2}></td>
            </tr>
            <tr>
                <td className={'form'}></td>
            </tr>
        </table>
    </>;
}