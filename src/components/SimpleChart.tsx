import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {DailyLog} from '../types';
import {format} from 'date-fns';

interface SimpleChartProps {
  logs: DailyLog[];
}

export default function SimpleChart({ logs }: SimpleChartProps) {
  const chartData = logs.map(l => ({
    date: format(new Date(l.date), 'MM/dd'),
    weight: l.weight,
  })).slice(-7);

  if (logs.length < 2) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-sm font-bold text-gray-700 mb-4">最近の体重トレンド</h3>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#9CA3AF'}} 
              dy={10}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#9CA3AF'}} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#F97316" 
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
