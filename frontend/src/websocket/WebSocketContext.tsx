// src/contexts/WebSocketContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketManager } from './WebSocketManager';
import { SubscriptionManager } from './SubscriptionManager';
import { WebSocketStatus } from './types';

interface WebSocketContextValue {
  wsManager: WebSocketManager;
  subManager: SubscriptionManager;
  status: WebSocketStatus;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export interface WebSocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  url, 
  children 
}) => {
  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
  const [managers] = useState(() => {
    const wsManager = WebSocketManager.getInstance(url);
    const subManager = SubscriptionManager.getInstance(wsManager);
    return { wsManager, subManager };
  });

  useEffect(() => {
    // 监听连接状态
    managers.wsManager.addStatusHandler(setStatus);

    // 初始化连接
    managers.wsManager.connect();

    return () => {
      managers.wsManager.removeStatusHandler(setStatus);
      managers.wsManager.disconnect();
      managers.subManager.removeAllSubscriptions();
    };
  }, [managers.wsManager, managers.subManager]);

  const value: WebSocketContextValue = {
    wsManager: managers.wsManager,
    subManager: managers.subManager,
    status
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// 自定义Hook用于获取WebSocket上下文
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};