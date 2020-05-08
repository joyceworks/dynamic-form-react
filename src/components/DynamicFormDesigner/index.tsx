import './index.css';
import React, {useState} from 'react';
import {Widget} from "./schemas";
import {
    AiOutlineCalendar,
    AiOutlineCheckSquare, AiOutlineCopy, AiOutlineDelete,
    AiOutlineDownSquare,
    AiOutlineEdit, AiOutlineEye, AiOutlineMinus,
    AiOutlineOrderedList, AiOutlineSave,
    AiOutlineTable
} from "react-icons/ai";
import {DynamicForm} from "../DynamicForm";

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
            <tbody>
            <tr>
                <td className={'left'} rowSpan={2}>
                    <div>基础字段</div>
                    <ul className={'panel'}>
                        {
                            basicWidgets.map(widget => <li key={widget.name} className={'widget'}>
                                {widget.icon}
                                <span>{widget.name}</span>
                            </li>)
                        }
                    </ul>
                    <div>高级字段</div>
                    <ul className={'panel'}>
                        {
                            advancedWidgets.map(widget => <li key={widget.name}
                                                              className={'widget'}>
                                {widget.icon}
                                <span>{widget.name}</span>
                            </li>)
                        }
                    </ul>
                    <div id={"draggable"}/>
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
                <td className={'right'} rowSpan={2}/>
            </tr>
            <tr>
                <td className={'form'}>
                    <div style={{height: '100%', overflowY: 'auto'}}>
                        <DynamicForm element={{
                            type: 'grid',
                            id: '1',
                            swimlanes: [{
                                span: 100,
                                elements: [
                                    {
                                        type: 'input',
                                        id: '2',
                                        value: null,
                                        labeled: true,
                                        label: 'test',
                                        required: true,
                                        placeholder: 'test ph',
                                        warningable: true
                                    },
                                    {
                                        type: 'input',
                                        id: '2',
                                        value: null,
                                        labeled: true,
                                        label: 'test',
                                        required: true,
                                        placeholder: 'test ph',
                                        warningable: true
                                    }
                                ]
                            }]
                        }}/>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </>;
}