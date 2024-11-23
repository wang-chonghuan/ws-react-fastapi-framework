/*
// App.tsx
import { WebSocketProvider } from './WebSocketContext';

function App() {
  return (
    <WebSocketProvider url="ws://your-server-url">
      <YourComponents />
    </WebSocketProvider>
  );
}

// ExampleComponent.tsx
import { useSubscription } from './hooks/useSubscription';
import { SubscriptionType } from './websocket/types';

function ExampleComponent() {
  const { data, error, isLoading, status } = useSubscription({
    id: "unique-subscription-id",
    config: {
      type: SubscriptionType.SE,
      paramId: "param1",
      period: 3600,    // 1小时
      samples: 60,     // 60个采样点
      window: 60,      // 60秒聚合窗口
      interval: 1      // 每1分钟更新
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <div>Status: {status}</div>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
}
*/