import React, {useState} from 'react';
import {Plus, Trash2, Scale} from 'lucide-react';
import {DailyLog, WorkoutLog} from '../types';

interface LogFormProps {
  onAddLog: (log: Omit<DailyLog, 'id'>) => void;
}

export default function LogForm({ onAddLog }: LogFormProps) {
  const [weight, setWeight] = useState<string>('');
  const [workouts, setWorkouts] = useState<Omit<WorkoutLog, 'id'>[]>([]);

  const addWorkout = () => {
    setWorkouts([...workouts, { exercise: 'プッシュアップ', value: 10, unit: 'reps' }]);
  };

  const removeWorkout = (index: number) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const updateWorkout = (index: number, field: keyof WorkoutLog, value: any) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: value };
    setWorkouts(newWorkouts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    
    onAddLog({
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      workouts: workouts as WorkoutLog[],
    });
    
    setWeight('');
    setWorkouts([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">今日の体重は？</label>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-orange-200 transition-colors">
            <Scale size={20} className="text-gray-400" />
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="00.0"
              className="bg-transparent outline-none font-bold text-xl w-full"
              required
            />
            <span className="text-gray-400 font-bold">kg</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">トレーニング内容</label>
          <div className="space-y-2">
            {workouts.map((w, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <input
                  type="text"
                  value={w.exercise}
                  placeholder="種目名"
                  onChange={(e) => updateWorkout(i, 'exercise', e.target.value)}
                  className="bg-transparent text-sm font-bold w-full outline-none"
                />
                <input
                  type="number"
                  value={w.value}
                  onChange={(e) => updateWorkout(i, 'value', parseFloat(e.target.value))}
                  className="bg-transparent text-sm font-bold w-16 text-right outline-none"
                />
                <select
                  value={w.unit}
                  onChange={(e) => updateWorkout(i, 'unit', e.target.value)}
                  className="bg-transparent text-[11px] font-bold outline-none"
                >
                  <option value="reps">回</option>
                  <option value="seconds">秒</option>
                  <option value="minutes">分</option>
                </select>
                <button 
                  type="button"
                  onClick={() => removeWorkout(i)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWorkout}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-gray-300 hover:text-gray-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> トレーニングを追加
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
      >
        今日の記録を保存！
      </button>
    </form>
  );
}
