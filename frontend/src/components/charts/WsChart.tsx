import { SubscriptionType } from "../../websocket/types";
import { useSubscription } from "../../websocket/useSubscription";
import { useMemo, useState, useEffect } from "react";

interface WsChartProps {
  title: string;
  className?: string;
}

function WsChart({ title, className = '' }: WsChartProps) {
  // Use useMemo to ensure the stability of the subscription configuration object
  const subscriptionConfig = useMemo(() => ({
    id: "unique-subscription-id",
    config: {
      type: SubscriptionType.SE as const,
      paramId: "param1",
      period: 3600,    // 1 hour
      samples: 60,     // 60 sample points
      window: 60,      // 60-second aggregation window
      interval: 1      // Update every 1 minute
    }
  }), []); // Empty dependency array, as these configurations are static

  const { data, error, isLoading, status } = useSubscription(subscriptionConfig);
  
  // Add message statistics status
  const [messageStats, setMessageStats] = useState({
    count: 0,
    lastMessageSize: 0,
  });

  // Update statistics when new data is received
  useEffect(() => {
    if (data) {
      setMessageStats(prev => ({
        count: prev.count + 1,
        lastMessageSize: JSON.stringify(data).length,
      }));
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-md font-medium mb-4">{title}</h3>
      <div className="w-full h-[30vh] overflow-y-auto text-sm space-y-1.5">
        <div>Subscription Type: {subscriptionConfig.config.type}</div>
        <div>Parameter ID: {subscriptionConfig.config.paramId}</div>
        <div>Sample Period: {subscriptionConfig.config.period}s</div>
        <div>Sample Points: {subscriptionConfig.config.samples}</div>
        <div>Aggregation Window: {subscriptionConfig.config.window}s</div>
        <div>Update Interval: {subscriptionConfig.config.interval}min</div>
        <div>Connection Status: {status}</div>
        <div>Messages Received: {messageStats.count}</div>
        <div>Latest Message Size: {messageStats.lastMessageSize} bytes</div>
        <div>Data Type: {data ? typeof data : 'unknown'}</div>
        <div>Data Structure: {data ? Array.isArray(data) ? 'Array' : 'Object' : 'unknown'}</div>
      </div>
    </div>
  );
}

export default WsChart;