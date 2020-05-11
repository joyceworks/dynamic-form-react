import React, {Fragment, useEffect, useReducer, useState} from 'react';
import {Layout, Button, Space} from 'antd';
import {DndProvider} from "react-dnd";
import Backend from "react-dnd-html5-backend";
import {
    AiOutlineCalendar,
    AiOutlineCheckSquare,
    AiOutlineCopy,
    AiOutlineDownSquare,
    AiOutlineEdit,
    AiOutlineMinus,
    AiOutlineOrderedList,
    AiOutlineTable
} from "react-icons/ai";
import {DynamicForm} from "./components/DynamicForm";
import {WidgetData} from "./schemas/WidgetData";
import './index.css';
import {Widget} from "./components/Widget";
import {locate, findCellDataList, locateByRef, createWidgetInstance} from "./util";
import {CellData} from "./schemas/CellData";

const {Sider, Content, Header} = Layout;

const rootCellData: CellData = {
    type: 'grid',
    id: '11270307',
    swimlanes: [{span: 100, cellDataList: []}]
};

const widgetGroup: { name: string, widgets: WidgetData[] }[] = [
    {
        name: '基础字段',
        widgets: [
            {type: 'input', icon: <AiOutlineEdit/>, name: '单行文本', enable: true},
            {type: 'textarea', icon: <AiOutlineEdit/>, name: '多行文本', enable: true},
            {type: 'dropdown', icon: <AiOutlineDownSquare/>, name: '下拉选择', enable: true},
            {type: 'datetime', icon: <AiOutlineCalendar/>, name: '日期时间', enable: true},
            {type: 'tree', icon: <AiOutlineDownSquare/>, name: '级联选择', enable: false},
            {type: 'checkbox', icon: <AiOutlineCheckSquare/>, name: '多选', enable: true},
            {type: 'checkbox', icon: <AiOutlineCheckSquare/>, name: '单选', enable: true},
        ]
    },
    {
        name: '高级字段',
        widgets: [
            {type: 'grid', icon: <AiOutlineTable/>, name: '布局', enable: true},
            {type: 'list', icon: <AiOutlineOrderedList/>, name: '列表', enable: true},
            {type: 'separator', icon: <AiOutlineMinus/>, name: '分割线', enable: false},
            {type: 'tab', icon: <AiOutlineCopy/>, name: '标签页', enable: false},
        ]
    }
];

export const DynamicFormDesignerContext = React.createContext<any>(null);

export const DynamicFormDesigner = function () {
    const [data, dispatch] = useReducer(function (state: any, action: any) {
        if (action.type === 'MOVE') {
            const [id, swimlaneIndex] = locate(state, action.id);
            if (id) {
                const copy = JSON.parse(JSON.stringify(state));
                const cells = findCellDataList(copy, id, swimlaneIndex);
                if (cells) {
                    const splice = cells.splice(action.dragIndex, 1);
                    if (splice.length > 0) {
                        cells.splice(action.hoverIndex, 0, splice[0]);
                    }
                }
                return copy;
            }
            return state;
        } else if (action.type === 'ADD') {
            const [id, swimlaneIndex] = locateByRef(state, action.cellDataList);
            if (id) {
                const copy = JSON.parse(JSON.stringify(state));
                const cells = findCellDataList(copy, id, swimlaneIndex);
                cells?.push(action.cellData);
                return copy;
            }
            return state;
        } else {
            return state;
        }
    }, rootCellData);

    useEffect(function () {
        console.log(data);
    }, [data]);


    return <>
        <DynamicFormDesignerContext.Provider value={dispatch}>
            <DndProvider backend={Backend}>
                <Layout className={'layout'}>
                    <Sider width={280} className={'left'}>
                        {
                            widgetGroup.map(g => <Fragment key={g.name}>
                                <div style={{color: "white"}}>{g.name}</div>
                                <ul className={'panel'}>
                                    {
                                        g.widgets.map((w: WidgetData) => {
                                            return <Widget key={w.name} widget={w}/>;
                                        })
                                    }
                                </ul>
                            </Fragment>)
                        }
                    </Sider>
                    <Content>
                        <Layout style={{height: '100%'}}>
                            <Header>
                                <Space>
                                    <Button>清空</Button><Button>预览</Button><Button>保存</Button>
                                </Space>
                            </Header>
                            <Content className={'form'} style={{height: '100%'}}>
                                <DynamicForm style={{height: '100%'}} element={data}/>
                            </Content>
                        </Layout>
                    </Content>
                    <Sider width={280} className={'right'}/>
                </Layout>
            </DndProvider>
        </DynamicFormDesignerContext.Provider>
    </>;
}