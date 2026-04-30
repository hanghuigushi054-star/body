/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DailyLog, UserSettings } from './types';
import Dashboard from './components/Dashboard';
import LogForm from './components/LogForm';
import SimpleChart from './components/SimpleChart';
import ProfileSettings from './components/ProfileSettings';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

const STORAGE_KEY = 'yurutore_metrics_logs';
const SETTINGS_KEY = 'yurutore_metrics_settings';

export default function App() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    targetWeight: 65,
    height: 170,
    age: 30,
    gender: 'male',
    unit: 'kg'
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [logs, settings, isInitialized]);

  const handleAddLog = (newLog: Omit<DailyLog, 'id'>) => {
    const logWithId: DailyLog = { ...newLog, id: crypto.randomUUID() };
    const updatedLogs = [...logs, logWithId];
    setLogs(updatedLogs);
  };

  const updateTarget = (val: string) => {
    setSettings({ ...settings, targetWeight: parseFloat(val) || 0 });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <header className="mb-6 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-2"
          >
            <div className="bg-orange-100 p-2 rounded-full">
              <Heart className="text-orange-500" fill="currentColor" size={24} />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black text-gray-800 mb-1 tracking-tight">ゆるトレ予想</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            AI Personal Weight Trainer
          </p>
        </header>

        {/* Motivational Banner */}
        {logs.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 bg-gradient-to-br from-orange-400 to-orange-500 text-white p-6 rounded-3xl shadow-xl shadow-orange-100 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Heart size={80} fill="white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">目標まであと...</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black tracking-tighter tabular-nums">
                {Math.abs(logs[logs.length - 1].weight - settings.targetWeight).toFixed(1)}
              </span>
              <span className="text-lg font-bold">kg</span>
            </div>
            <p className="text-xs font-bold mt-3 bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
              {logs[logs.length - 1].weight > settings.targetWeight 
                ? "焦らず、自分のペースで絞っていこう！✨" 
                : "目標達成おめでとう！素晴らしいキープだね！🎉"}
            </p>
          </motion.div>
        )}

        <div className="space-y-6">
          <Dashboard logs={logs} settings={settings} />

          <SimpleChart logs={logs} />

          <ProfileSettings 
            settings={settings} 
            onUpdate={setSettings} 
          />

          <LogForm onAddLog={handleAddLog} />
        </div>

        <footer className="mt-12 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          Good luck on your journey!
        </footer>
      </div>
    </div>
  );
}
