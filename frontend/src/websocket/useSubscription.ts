// src/hooks/useSubscription.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  SubscriptionConfig, 
  SubscriptionData,
  WebSocketStatus,
} from '../websocket/types';
import { useWebSocket } from './WebSocketContext';

interface UseSubscriptionOptions {
  id: string;
  config: SubscriptionConfig;
  // 可选项，是否在WebSocket断开时自动重新订阅
  autoResubscribe?: boolean;
}

interface SubscriptionState {
  data: SubscriptionData | null;
  error: string | null;
  isLoading: boolean;
}

export function useSubscription({
  id,
  config,
  autoResubscribe = true
}: UseSubscriptionOptions) {
  const { subManager, status } = useWebSocket();
  const [state, setState] = useState<SubscriptionState>({
    data: null,
    error: null,
    isLoading: true
  });

  // 处理订阅数据的回调
  const handleSubscriptionData = useCallback((data: SubscriptionData) => {
    setState(prevState => ({
      ...prevState,
      data: data,
      error: data.error || null,
      isLoading: false
    }));
  }, []);

  // 创建订阅
  const subscribe = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      subManager.addSubscription(id, config, handleSubscriptionData);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }));
    }
  }, [id, config, subManager, handleSubscriptionData]);

  // 取消订阅
  const unsubscribe = useCallback(() => {
    subManager.removeSubscription(id);
  }, [id, subManager]);

  // 处理WebSocket连接状态变化
  useEffect(() => {
    if (status === WebSocketStatus.CONNECTED) {
      subscribe();
    } else if (status === WebSocketStatus.DISCONNECTED && autoResubscribe) {
      // 连接断开时清空数据
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: 'WebSocket disconnected'
      }));
    }
  }, [status, subscribe, autoResubscribe]);

  // 组件卸载时清理订阅
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  // 提供手动重新订阅的方法
  const resubscribe = useCallback(() => {
    unsubscribe();
    subscribe();
  }, [unsubscribe, subscribe]);

  return {
    ...state,
    resubscribe,
    status  // 也返回WebSocket状态便于组件判断
  };
}