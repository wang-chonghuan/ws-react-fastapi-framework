import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  title: string;
  data: number[];
  xAxisData: string[];
  className?: string;
}

const LineChart = ({ title, data, xAxisData, className = '' }: LineChartProps) => {
  const option = {
    grid: {
      top: 10,
      right: 10,
      bottom: 0,
      left: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 2
      }
    }],
    tooltip: {
      trigger: 'axis'
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-md font-medium mb-4">{title}</h3>
      <div className="w-full h-[30vh]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default LineChart;
