import {Cell} from "./components/Cell";
import React, {useContext} from "react";
import {CellData} from "../../../../schemas/CellData";
import {useDrop} from "react-dnd";
import {DynamicFormDesignerContext} from "../../../../index";

interface SwimlaneProps {
    elements: CellData[];
    direction: 'column' | 'row';
}

function createWidgetInstance(widgetType: string) {
    let element: CellData = {type: widgetType, id: widgetType + new Date().getTime()};
    if (element.type === 'grid') {
        element.swimlanes = [{span: 50, cellDataList: []}, {span: 50, cellDataList: []}];
    } else if (element.type === 'input') {
        element.label = '单行文本';
        element.placeholder = '请填写';
        element.required = false;
    } else if (element.type === 'textarea') {
        element.label = '多行文本';
        element.placeholder = '请填写';
        element.required = false;
    } else if (element.type === 'dropdown') {
        element.label = '下拉选择';
        element.placeholder = '请选择';
        element.options = [];
        element.required = false;
    } else if (element.type === 'list') {
        element.label = '列表';
        element.swimlanes = [{cellDataList: [], span: 100}];
    } else if (element.type === 'datetime') {
        element.label = '日期时间';
        element.placeholder = '请选择';
        element.required = false;
    } else if (element.type === 'checkbox') {
        element.label = '多选';
        element.options = [];
        element.required = false;
    } else if (element.type === 'radio') {
        element.label = '单选';
        element.options = [];
        element.required = false;
    }
    return element;
}

export const Swimlane = function ({elements, direction}: SwimlaneProps) {
    const dispatch = useContext(DynamicFormDesignerContext);
    const [{isOver}, drop] = useDrop({
        accept: ['input', 'grid'],
        drop: item => {
            if (isOver) {
                dispatch({
                    type: 'ADD',
                    cellData: createWidgetInstance(item.type as string),
                    cellDataList: elements,
                });
            }
        },
        collect: monitor => ({isOver: monitor.isOver({shallow: true})})
    });

    const layout = direction === 'column' ? 'default' : 'inline';
    return <td className={'swimlane ' + direction + (isOver ? ' hovered' : '')} ref={drop}>
        {
            elements.map((child, index) =>
                <Cell key={child.id} layout={layout} cellData={child} index={index}/>)
        }
    </td>;
}