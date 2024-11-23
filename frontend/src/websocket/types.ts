// src/websocket/types.ts

// 订阅类型枚举
export enum SubscriptionType {
  PARAM_HISTORY = 'PARAM_HISTORY',  // 单参数历史值
  MULTI_PARAM = 'MULTI_PARAM'       // 多参数最新值
}

// 单参数历史值订阅配置
export interface ParamHistorySubscriptionConfig {
  type: SubscriptionType.PARAM_HISTORY;
  plantId: string;
  component: string;
  parameter: string;
  range: string;
  aggregateWindow: string;
  queryPeriod: string;
}

// 响应
export interface ParamHistoryPoint {
  time: string
  value: number
}

export interface ParamHistoryRes {
  task_id: string
  plantId: string
  component: string
  parameter: string
  data: ParamHistoryPoint[]
}

// 多参数最新值订阅配置
export interface MultiParamSubscriptionConfig {
  type: SubscriptionType.MULTI_PARAM;
  plantId: string;
  paramList: string[];
  startTime: string;
  interval: number;
  queryPeriod: number;
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

// 统一订阅配置类型
export type SubscriptionConfig = ParamHistorySubscriptionConfig | MultiParamSubscriptionConfig;

// 更新订阅数据接口
export interface SubscriptionData {
  id: string;
  timestamp: number;
  values: ParamHistoryRes | MultiParameterDataResponse | null;
  error?: string;
}

// WebSocket消息类型
export interface WSMessage {
  type: 'subscription' | 'response' | 'error';
  id?: string;
  payload: any;
}

// 订阅回调函数类型
export type SubscriptionCallback = (data: SubscriptionData) => void;

// 订阅项结构
export interface Subscription {
  id: string;
  config: SubscriptionConfig;
  callback: SubscriptionCallback;
}

// WebSocket状态
export enum WebSocketStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}