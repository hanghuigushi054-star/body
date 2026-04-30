import React from 'react';
import {UserSettings} from '../types';
import {User, Ruler, Calendar, Target, UserCircle, Activity} from 'lucide-react';

interface ProfileSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export default function ProfileSettings({ settings, onUpdate }: ProfileSettingsProps) {
  const [localSettings, setLocalSettings] = React.useState({
    targetWeight: settings.targetWeight.toString(),
    height: settings.height.toString(),
    age: settings.age.toString(),
  });

  // Keep local state in sync with parent if parent updates (e.g. on load)
  React.useEffect(() => {
    setLocalSettings({
      targetWeight: settings.targetWeight.toString(),
      height: settings.height.toString(),
      age: settings.age.toString(),
    });
  }, [settings.targetWeight, settings.height, settings.age]);

  const commitChange = (field: keyof UserSettings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdate({ ...settings, [field]: numValue });
    }
  };

  const handleLocalChange = (field: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdate({ ...settings, [field as keyof UserSettings]: numValue });
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-full">
            <UserCircle size={20} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-800">プロフィール設定</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AI Analysis Profile</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* 目標体重 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 flex items-center gap-1.5 uppercase">
            <Target size={12} className="text-orange-400" /> Goal Weight
          </label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-orange-100 focus-within:bg-white transition-all">
            <input
              type="text"
              inputMode="decimal"
              value={localSettings.targetWeight}
              onChange={(e) => handleLocalChange('targetWeight', e.target.value)}
              className="bg-transparent outline-none font-black text-lg w-full text-gray-700"
              placeholder="00.0"
            />
            <span className="text-gray-400 font-black text-xs">kg</span>
          </div>
        </div>

        {/* 身長 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 flex items-center gap-1.5 uppercase">
            <Ruler size={12} className="text-blue-400" /> Stature
          </label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <input
              type="text"
              inputMode="decimal"
              value={localSettings.height}
              onChange={(e) => handleLocalChange('height', e.target.value)}
              className="bg-transparent outline-none font-black text-lg w-full text-gray-700"
              placeholder="000.0"
            />
            <span className="text-gray-400 font-black text-xs">cm</span>
          </div>
        </div>

        {/* 年齢 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 flex items-center gap-1.5 uppercase">
            <Calendar size={12} className="text-emerald-400" /> Age
          </label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-emerald-100 focus-within:bg-white transition-all">
            <input
              type="text"
              inputMode="numeric"
              value={localSettings.age}
              onChange={(e) => handleLocalChange('age', e.target.value)}
              className="bg-transparent outline-none font-black text-lg w-full text-gray-700"
              placeholder="00"
            />
            <span className="text-gray-400 font-black text-xs">歳</span>
          </div>
        </div>

        {/* 性別 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 flex items-center gap-1.5 uppercase">
            <User size={12} className="text-purple-400" /> Gender
          </label>
          <div className="flex p-1 bg-gray-50 rounded-2xl border-2 border-transparent">
            <button
              onClick={() => onUpdate({ ...settings, gender: 'male' })}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                settings.gender === 'male' 
                ? 'bg-white shadow-sm text-blue-500 border border-blue-50' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              男性
            </button>
            <button
              onClick={() => onUpdate({ ...settings, gender: 'female' })}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                settings.gender === 'female' 
                ? 'bg-white shadow-sm text-pink-500 border border-pink-50' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              女性
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 flex gap-3">
        <div className="text-orange-500 pt-0.5">
          <Activity size={16} />
        </div>
        <p className="text-[10px] text-orange-700/70 font-medium leading-relaxed">
          入力された身長・年齢・性別から、AIがあなたの<span className="font-bold">代謝や体組成</span>を推定し、より精度の高い体重予想とアドバイスを行います。
        </p>
      </div>
    </div>
  );
}
