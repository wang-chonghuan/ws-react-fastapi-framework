import { useState, useEffect } from 'react';
import { SubscriptionConfig } from '../websocket/types';
import { useWebSocket } from './WebSocketContext';

interface SubscriptionInfo {
  id: string;
  config: SubscriptionConfig;
  lastUpdate?: Date;
}

export function useWebSocketDebug() {
  const { wsManager, subManager } = useWebSocket();
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const statusHandler = (status: string) => {
      setIsConnected(status === 'CONNECTED');
    };

    // 添加状态监听
    wsManager.addStatusHandler(statusHandler);

    // 订阅更新的轮询
    const interval = setInterval(() => {
      const subs: SubscriptionInfo[] = [];
      // 使用 Map 的 entries() 方法遍历
      for (const [id, subscription] of subManager.getSubscriptions().entries()) {
        subs.push({
          id,
          config: subscription.config,
          lastUpdate: new Date()
        });
      }
      setSubscriptions(subs);
    }, 1000);

    return () => {
      wsManager.removeStatusHandler(statusHandler);
      clearInterval(interval);
    };
  }, [wsManager, subManager]);

  return {
    isConnected,
    subscriptions
  };
}