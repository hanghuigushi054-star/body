import {DailyLog, UserSettings} from '../types';
import {Target, Scale, Activity, Zap} from 'lucide-react';

interface DashboardProps {
  logs: DailyLog[];
  settings: UserSettings;
}

export default function Dashboard({ logs, settings }: DashboardProps) {
  const latestLog = logs[logs.length - 1];
  const weight = latestLog?.weight;
  const currentWeightDisp = weight ?? '--';

  const bmi = weight && settings.height 
    ? (weight / Math.pow(settings.height / 100, 2)).toFixed(1) 
    : '--';

  const bodyFat = weight && settings.height && settings.age
    ? (
        settings.gender === 'male'
          ? 1.20 * parseFloat(bmi) + 0.23 * settings.age - 16.2
          : 1.20 * parseFloat(bmi) + 0.23 * settings.age - 5.4
      ).toFixed(1)
    : '--';

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-500">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">現在の体重</p>
            <p className="text-3xl font-bold">{currentWeightDisp} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">目標体重</p>
            <p className="text-3xl font-bold">{settings.targetWeight} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center gap-3">
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-500">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">BMI</p>
            <p className="text-xl font-bold">{bmi}</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-purple-50 flex items-center gap-3">
          <div className="bg-purple-50 p-2.5 rounded-lg text-purple-500">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">推定体脂肪率</p>
            <p className="text-xl font-bold">{bodyFat}<span className="text-sm ml-0.5">%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
