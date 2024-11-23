import { 
  SubscriptionType, 
  ParamHistorySubscriptionConfig,
  ParamHistoryRes
} from "../../websocket/types";
import { useSubscription } from "../../websocket/useSubscription";
import { useMemo, useState, useEffect } from "react";

interface WsChartProps {
  title: string;
  className?: string;
}

function WsChart({ title, className = '' }: WsChartProps) {
  // 构建订阅配置
  const config: ParamHistorySubscriptionConfig = useMemo(() => ({
    type: SubscriptionType.PARAM_HISTORY,
    plantId: "plant1",
    component: "comp1",
    parameter: "param1",
    range: "1d",           // 1天的数据
    aggregateWindow: "1h", // 1小时聚合
    queryPeriod: "10s"      // 查询周期10秒
  }), []); 

  const { data, error, isLoading, status } = useSubscription({
    id: "unique-subscription-id",
    config,
    autoResubscribe: true
  });
  
  const [messageStats, setMessageStats] = useState({
    count: 0,
    lastMessageSize: 0,
  });

  useEffect(() => {
    if (data) {
      setMessageStats(prev => ({
        count: prev.count + 1,
        lastMessageSize: JSON.stringify(data).length,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      console.log('Received subscription data:', data);
      console.log('Values:', data.values);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // 更精确的类型检查和解析
  const historyData = data?.values as ParamHistoryRes | null;
  
  // 添加安全检查
  const latestValue = historyData?.data && historyData.data.length > 0
    ? historyData.data[historyData.data.length - 1]
    : null;

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-md font-medium mb-4">{title}</h3>
      
      <div className="text-xs text-gray-500 mb-2">
        Raw data: {JSON.stringify(data, null, 2)}
      </div>
      
      <div className="w-full h-[30vh] overflow-y-auto text-sm space-y-1.5">
        <div>Subscription Type: {config.type}</div>
        <div>Plant ID: {config.plantId}</div>
        <div>Component: {config.component}</div>
        <div>Parameter: {config.parameter}</div>
        <div>Range: {config.range}</div>
        <div>Aggregate Window: {config.aggregateWindow}</div>
        <div>Query Period: {config.queryPeriod}</div>
        <div>Connection Status: {status}</div>
        <div>Messages Received: {messageStats.count}</div>
        <div>Latest Message Size: {messageStats.lastMessageSize} bytes</div>
        {historyData && (
          <>
            <div>Task ID: {historyData.task_id}</div>
            <div>Data Points: {historyData.data?.length || 0}</div>
            <div>Latest Value: {
              latestValue
                ? `${latestValue.value} (${latestValue.time})`
                : 'No data'
            }</div>
          </>
        )}
      </div>
    </div>
  );
}

export default WsChart;