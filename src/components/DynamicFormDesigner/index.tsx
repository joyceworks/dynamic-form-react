import './index.css';
import React, {useContext, useState} from 'react';
import {Widget} from "./schemas";
import {Element} from "../../schemas/Element";

import {
    AiOutlineCalendar,
    AiOutlineCheckSquare, AiOutlineCopy, AiOutlineDelete,
    AiOutlineDownSquare,
    AiOutlineEdit, AiOutlineEye, AiOutlineMinus,
    AiOutlineOrderedList, AiOutlineSave,
    AiOutlineTable
} from "react-icons/ai";
import {DynamicForm} from "../DynamicForm";

interface DraggingInfo {
    mode: 'move' | 'copy' | null;
    target: any | null;
    offsetX: number | null;
    offsetY: number | null;
    x: number | null;
    y: number | null;
}

export const DynamicFormDesignerContext = React.createContext<any>(null);

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

    const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
        mode: null, offsetX: null, offsetY: null, target: null, x: null, y: null
    });

    const [data, setData] = useState<Element>({
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
            ]
        }]
    });

    return <>
        <DynamicFormDesignerContext.Provider value={draggingInfo}>
            <table className={'layout'} onMouseMove={event => {
                event.persist();
                if (draggingInfo.target) {
                    setDraggingInfo(prevState => {
                        return {
                            ...prevState,
                            // @ts-ignore
                            x: event.nativeEvent.clientX - draggingInfo.offsetX,
                            // @ts-ignore
                            y: event.nativeEvent.clientY - draggingInfo.offsetY
                        }
                    })
                }
            }}>
                <tbody>
                <tr>
                    <td className={'left'} rowSpan={2}>
                        <div>基础字段</div>
                        <ul className={'panel'}>
                            {
                                basicWidgets.map(widget => {
                                    return <li key={widget.name} className={'widget'}
                                               onMouseDown={event => {
                                                   setDraggingInfo({
                                                       offsetX: event.nativeEvent.offsetX,
                                                       offsetY: event.nativeEvent.offsetY,
                                                       target: widget,
                                                       x: event.nativeEvent.clientX - event.nativeEvent.offsetX,
                                                       y: event.nativeEvent.clientY - event.nativeEvent.offsetY,
                                                       mode: 'copy'
                                                   });
                                                   setData(prevState => {
                                                       prevState.swimlanes![0].elements.push({
                                                           type: 'indicator',
                                                           id: 'indicator'
                                                       });
                                                       return prevState;
                                                   });
                                               }}>
                                        {widget.icon}
                                        <span>{widget.name}</span>
                                    </li>;
                                })
                            }
                        </ul>
                        <div>高级字段</div>
                        <ul className={'panel'}>
                            {
                                advancedWidgets.map(widget => {
                                    return <li key={widget.name} className={'widget'}>
                                        {widget.icon}
                                        <span>{widget.name}</span>
                                    </li>;
                                })
                            }
                        </ul>
                        <div id={"draggable"}
                             style={{left: draggingInfo?.x + 'px', top: draggingInfo?.y + 'px'}}>
                            {
                                draggingInfo && draggingInfo.target !== null && <>
                                  <li key={draggingInfo.target.name} className={'widget'}>
                                      {draggingInfo.target.icon}
                                    <span>{draggingInfo.target.name}</span>
                                  </li>
                                </>
                            }
                        </div>
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
                            <DynamicForm element={data}/>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </DynamicFormDesignerContext.Provider>
    </>;
}