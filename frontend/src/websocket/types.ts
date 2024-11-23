// src/websocket/types.ts

// 订阅类型枚举
export enum SubscriptionType {
  SE = 'SE',  // 单参数历史值事件
  ME = 'ME'   // 多参数最新值事件
}

// SE订阅配置
export interface SESubscriptionConfig {
  type: SubscriptionType.SE;
  paramId: string;     // 参数ID
  period: number;      // 时间段P
  samples: number;     // 采样数N
  window: number;      // 聚合窗口W
  interval: number;    // 更新间隔X(分钟)
}

// ME订阅配置
export interface MESubscriptionConfig {
  type: SubscriptionType.ME;
  paramIds: string[];  // 参数ID列表
  interval: number;    // 更新间隔Y(秒)
}

// 统一订阅配置类型
export type SubscriptionConfig = SESubscriptionConfig | MESubscriptionConfig;

// 订阅消息的数据结构
export interface SubscriptionData {
  id: string;         // 订阅ID
  timestamp: number;  // 时间戳
  values: any;        // 数据值，具体类型取决于订阅类型
  error?: string;     // 可能的错误信息
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