import {useState, useEffect} from 'react';
import {UserSettings} from '../types';
import {proposeTrainingMenu, TrainingMenu} from '../lib/gemini';
import {Dumbbell, Play} from 'lucide-react';
import {motion} from 'motion/react';

interface Props {
  settings: UserSettings;
  currentWeight?: number;
}

export default function TrainingMenuPanel({settings, currentWeight}: Props) {
  const [menu, setMenu] = useState<TrainingMenu | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only generate menu if the goal is set and not "just_record"
    if (settings.goal === 'just_record') {
      setMenu(null);
      return;
    }

    async function loadMenu() {
      setLoading(true);
      const result = await proposeTrainingMenu(settings, currentWeight);
      setMenu(result);
      setLoading(false);
    }
    
    loadMenu();
  }, [settings.goal, settings.environment, settings.age, settings.gender, settings.targetWeight, currentWeight]);

  if (settings.goal === 'just_record') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 mb-8 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-indigo-50 pb-3 mb-4">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Dumbbell size={20} className="text-indigo-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-indigo-900">AIのおすすめトレーニング</h3>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Today's Menu</p>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4 animate-pulse pt-2">
          <div className="h-6 bg-indigo-50 rounded-lg w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-indigo-50 rounded w-full" />
            <div className="h-4 bg-indigo-50 rounded w-5/6" />
          </div>
        </div>
      ) : menu ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h4 className="text-lg font-black text-gray-800 mb-1">{menu.title}</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{menu.description}</p>
          </div>
          
          <div className="space-y-2">
            {menu.exercises.map((ex, i) => (
              <div key={i} className="bg-indigo-50/50 rounded-2xl p-3 flex items-start gap-3">
                <div className="bg-white p-1.5 rounded-xl shadow-sm mt-0.5">
                  <Play size={14} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-indigo-900">{ex.name}</span>
                    <span className="text-xs font-black text-indigo-500 bg-white px-2 py-0.5 rounded-lg ml-2">{ex.reps}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-snug">{ex.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl">
            <p className="text-sm font-bold text-center">🔥 {menu.motivation}</p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
