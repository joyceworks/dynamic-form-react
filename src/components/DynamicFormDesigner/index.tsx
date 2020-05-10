import React, {useState, Fragment, useReducer} from 'react';
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
import {createWidgetInstance, findListOfIndicatorInside} from "./util";
import {Element} from "../../schemas/Element";
import {DynamicForm} from "../DynamicForm";
import {Widget} from "./schemas";
import './index.css';
import {Layout, Button, Space} from 'antd';

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
    const {Sider, Content, Header} = Layout;

    const widgetGroup: { name: string, widgets: Widget[] }[] = [
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

    const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
        mode: null, offsetX: null, offsetY: null, target: null, x: null, y: null
    });

    const [data, dispatch] = useReducer(function (state: any, action: any) {
        switch (action.type) {
            case 'MOUSEOVER':
                if (draggingInfo.target) {
                    const indicators = action.elements.filter((element: Element) => element.type === 'indicator');
                    if (indicators.length > 0) {
                        const index = action.elements.indexOf(indicators[0]);
                        action.elements.splice(index, 1);
                        console.log('removed');
                    }
                    action.elements.push({
                        type: 'indicator',
                        id: 'indicator',
                    });
                    console.log('pushed');
                }
                return {...state};
            case 'MOUSEOUT':
                if (draggingInfo.target) {
                    const indicators = action.elements.filter((element: Element) => element.type === 'indicator');
                    if (indicators.length > 0) {
                        const index = action.elements.indexOf(indicators[0]);
                        action.elements.splice(index, 1);
                        console.log('removed');
                    }
                }
                return {...state};
            default:
                const elements = findListOfIndicatorInside(state);
                if (elements != null) {
                    const indicator = elements.filter(element => element.type === 'indicator')[0];
                    const index = elements.indexOf(indicator);
                    const element = createWidgetInstance(draggingInfo.target.type);
                    elements.splice(index, 1, element);
                }
                setDraggingInfo(prevState => ({...prevState, target: null}));
                return {...state};
        }
    }, {
        type: 'grid',
        id: '11270307',
        swimlanes: [{span: 100, elements: []}]
    });

    function handleWidgetMouseDown(event: React.MouseEvent<HTMLLIElement>, widget: Widget) {
        setDraggingInfo({
            offsetX: event.nativeEvent.offsetX,
            offsetY: event.nativeEvent.offsetY,
            target: widget,
            x: event.nativeEvent.clientX - event.nativeEvent.offsetX,
            y: event.nativeEvent.clientY - event.nativeEvent.offsetY,
            mode: 'copy'
        });
        // setData(prevState => {
        //     const copy = JSON.parse(JSON.stringify(prevState));
        //     copy.swimlanes![0].elements.push({
        //         type: 'indicator',
        //         id: 'indicator'
        //     });
        //     return copy;
        // });
    }

    function handleLayoutMouseMove(event: React.MouseEvent) {
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
    }

    function handleLayoutMouseUp() {
        // setDraggingInfo(prevState => ({...prevState, target: null}));
    }

    const indicatorPositionStyle = {left: draggingInfo?.x + 'px', top: draggingInfo?.y + 'px'};
    return <>
        <DynamicFormDesignerContext.Provider value={dispatch}>
            <Layout className={'layout'}
                    onMouseMove={event => handleLayoutMouseMove(event)}
                    onMouseUp={() => handleLayoutMouseUp()}>
                <Sider width={280} className={'left'}>
                    {
                        widgetGroup.map(group => <Fragment key={group.name}>
                            <div style={{color: "white"}}>{group.name}</div>
                            <ul className={'panel'}>
                                {
                                    group.widgets.map((widget: Widget) =>
                                        <li key={widget.name} className={'widget'}
                                            onMouseDown={e => handleWidgetMouseDown(e, widget)}>
                                            {widget.icon}
                                            <span>{widget.name}</span>
                                        </li>)
                                }
                            </ul>
                        </Fragment>)
                    }
                    <div id={"draggable"} style={indicatorPositionStyle}>
                        {
                            draggingInfo && draggingInfo.target !== null && <>
                              <li className={'widget'}>
                                  {draggingInfo.target.icon}
                                <span>{draggingInfo.target.name}</span>
                              </li>
                            </>
                        }
                    </div>
                </Sider>
                <Content>
                    <Layout style={{height: '100%'}}>
                        <Header>
                            <Space>
                                <Button>清空</Button>
                                <Button>预览</Button>
                                <Button>保存</Button>
                            </Space>
                        </Header>
                        <Content className={'form'} style={{height: '100%'}}>
                            <DynamicForm style={{height: '100%'}} element={data}/>
                        </Content>
                    </Layout>
                </Content>
                <Sider width={280} className={'right'}/>
            </Layout>
        </DynamicFormDesignerContext.Provider>
    </>;
}