import LineChart from '../components/charts/LineChart';
import WsChart from '../components/charts/WsChart';

const Charts = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 mt-[--topbar-h] mb-[--bottombar-h]">
      <WsChart title="Websocket Status" className="mb-4" />
      <LineChart 
        title="Weekly Sales"
        data={[820, 932, 901, 934, 1290, 1330, 1320]}
        xAxisData={weekDays}
        className="mb-4"
      />
      <LineChart 
        title="Weekly Costs"
        data={[150, 230, 224, 218, 135, 147, 260]}
        xAxisData={weekDays}
      />
    </div>
  );
};

export default Charts;
