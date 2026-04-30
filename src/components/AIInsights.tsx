import {AIAnalysis} from '../types';
import {Sparkles, RefreshCw} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';

interface AIInsightsProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AIInsights({ analysis, loading, onRefresh }: AIInsightsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-500" />
          <h3 className="font-bold text-gray-700">AIの予想 ＆ アドバイス</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="text-gray-300 hover:text-purple-500 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!analysis && !loading ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-4 text-center text-gray-400 text-sm"
          >
            今日のトレーニングを入力して、明日の体重を予想しよう！
          </motion.div>
        ) : loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-pulse" />
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-purple-50 p-4 rounded-xl flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700">明日の予想体重</span>
              <span className="text-2xl font-bold text-purple-700">{analysis?.predictedWeight} kg</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                「{analysis?.feedback}」
              </p>
              <p className="text-xs text-purple-400 font-bold">
                💡 {analysis?.nextLoadAdjustment}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
