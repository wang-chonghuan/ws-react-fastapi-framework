///////////////////////////////////////////////////////////////////////////////// 单参数历史值事件

// 请求
export interface ParamHistoryReq {
  plantId: string
  component: string
  parameter: string
  range: string
  aggregateWindow: string //  当 aggregateWindow 为 "0" 时：查询每天的最新值
  queryPeriod: string
}

export interface ParamHistoryPoint {
  time: string
  value: number
}

// 响应
// 更新 ParamHistoryModel 为 ParamHistoryRes
export interface ParamHistoryRes {
  task_id: string
  plantId: string
  component: string
  parameter: string
  data: ParamHistoryPoint[]
}

///////////////////////////////////////////////////////////////////////////////// 多参数最新值事件

// 请求
export interface MultiParameterDataRequest {
  plantId: string
  paramList: string[]
  startTime: string
  interval: number
  queryPeriod: number
}

// 响应
// 多参数响应接口
export interface ParamValue {
  paramCompKey: string
  values: Array<{
    time: string
    value: number
  }>
}

export interface MultiParameterDataResponse {
  plantId: string
  paramValues: ParamValue[]
}