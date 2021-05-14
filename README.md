### Usage

###### Designer

``` typescript
<Designer
  ref={designerRef}
  toolbar={false}
  defaultData={{
    type: "grid",
    id: "1127",
    lanes: [
      { 
        cellDataList: [
          {
            "type": "input",
            "id": "sn",
            "label": "单号",
          },
          {
            "id": "detail",
            "type": "list",
            "label": "订单明细",
            "lanes": [
              {
                "cellDataList": [
                  {
                    "id": "price",
                    "type": "input",
                    "label": "单价",
                    "width": "30%",
                  },
                  {
                    "id": "count",
                    "type": "input",
                    "label": "数量",
                    "width": "30%",
                  },
                  {
                    "id": "amount",
                    "type": "input",
                    "label": "小计",
                    "width": "40%",
                  }
                ]
              }
            ],
          },
        ]
      }
    ],
  }}
/>
```

###### Form

``` typescript
<Form
  data={{
    sn: '00000001',
    detail: [
      {
        price: 10,
        count: 2,
        amount: 20
      },
      {
        price: 12,
        count: 3,
        amount: 36
      },
    ]
  }}
  ref={designerRef}
  toolbar={false}
  defaultData={{
    type: "grid",
    id: "1127",
    lanes: [
      { 
        cellDataList: [
          {
            "type": "input",
            "id": "sn",
            "label": "单号",
          },
          {
            "id": "detail",
            "type": "list",
            "label": "订单明细",
            "lanes": [
              {
                "cellDataList": [
                  {
                    "id": "price",
                    "type": "input",
                    "label": "单价",
                    "width": "30%",
                  },
                  {
                    "id": "count",
                    "type": "input",
                    "label": "数量",
                    "width": "30%",
                  },
                  {
                    "id": "amount",
                    "type": "input",
                    "label": "小计",
                    "width": "40%",
                  }
                ]
              }
            ],
          },
        ]
      }
    ],
  }}
/>
```

### Preview

https://joyceworks.github.io/dynamic-form-react/
