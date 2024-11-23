// src/websocket/SubscriptionManager.ts

import { 
  SubscriptionConfig, 
  Subscription, 
  SubscriptionCallback, 
  WSMessage,
  SubscriptionData 
} from './types';
import { WebSocketManager } from './WebSocketManager';

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private wsManager: WebSocketManager;
  private subscriptions: Map<string, Subscription> = new Map();

  private constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
    this.wsManager.addMessageHandler(this.handleMessage);
  }

  public static getInstance(wsManager: WebSocketManager): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager(wsManager);
    }
    return SubscriptionManager.instance;
  }

  public addSubscription(
    id: string, 
    config: SubscriptionConfig, 
    callback: SubscriptionCallback
  ): void {
    // 如果已存在相同ID的订阅，先移除
    if (this.subscriptions.has(id)) {
      this.removeSubscription(id);
    }

    // 保存新订阅
    this.subscriptions.set(id, { id, config, callback });

    // 发送订阅请求
    this.wsManager.send({
      type: 'subscription',
      id,
      payload: {
        action: 'subscribe',
        config
      }
    });
  }

  public removeSubscription(id: string): void {
    if (!this.subscriptions.has(id)) {
      return;
    }

    // 发送取消订阅请求
    this.wsManager.send({
      type: 'subscription',
      id,
      payload: {
        action: 'unsubscribe'
      }
    });

    // 移除订阅
    this.subscriptions.delete(id);
  }

  public removeAllSubscriptions(): void {
    // 逐个移除所有订阅
    for (const id of this.subscriptions.keys()) {
      this.removeSubscription(id);
    }
  }

  public getSubscription(id: string): Subscription | undefined {
    return this.subscriptions.get(id);
  }

  public getSubscriptions(): Map<string, Subscription> {
    return this.subscriptions;
  }

  private handleMessage = (message: WSMessage): void => {
    // 只处理带有id的subscription类型消息
    if (message.type !== 'subscription' || !message.id) {
      return;
    }

    const subscription = this.subscriptions.get(message.id);
    if (!subscription) {
      console.warn(`Received message for unknown subscription: ${message.id}`);
      return;
    }

    // 检查是否是错误消息
    if ('error' in message.payload) {
      const errorData: SubscriptionData = {
        id: message.id,
        timestamp: Date.now(),
        values: null,
        error: message.payload.error
      };
      subscription.callback(errorData);
      return;
    }

    // 构造数据对象并调用回调
    const data: SubscriptionData = {
      id: message.id,
      timestamp: message.payload.timestamp || Date.now(),
      values: message.payload.values
    };
    
    subscription.callback(data);
  };
}