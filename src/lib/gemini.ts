import {GoogleGenAI} from "@google/genai";
import {DailyLog, AIAnalysis, UserSettings} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMetrics(
  logs: DailyLog[],
  settings: UserSettings
): Promise<AIAnalysis> {
  const model = "gemini-3-flash-preview";

  const latestLog = logs[logs.length - 1];
  const weight = latestLog?.weight;
  
  // 計算ロジックをAIに渡すことで精度を高める
  const bmi = weight && settings.height 
    ? (weight / Math.pow(settings.height / 100, 2)).toFixed(1) 
    : "不明";
  const bodyFat = weight && settings.height && settings.age
    ? (
        settings.gender === 'male'
          ? 1.20 * parseFloat(bmi as string) + 0.23 * settings.age - 16.2
          : 1.20 * parseFloat(bmi as string) + 0.23 * settings.age - 5.4
      ).toFixed(1)
    : "不明";
  
  const systemInstruction = `
    あなたは「親しみやすくも的確なパーソナルAIトレーナー」です。
    ユーザーの属性（年齢、性別、BMI、体脂肪率）と最近のトレーニングログを分析し、明日の予想体重とカジュアルなアドバイスを生成してください。
    
    アドバイスのコツ:
    - ユーザーの性別や年齢に合わせた、体調管理や食事、運動のアドバイスを含める。
    - 決して厳しくなりすぎず、モチベーションが上がるように。
    - 数値を無視した適当な予想ではなく、これまでのトレンドと最近のトレーニング量を考慮する。
    
    出力形式 (JSON):
    {
      "predictedWeight": number (明日の予想体重、小数点第一位まで),
      "nextLoadAdjustment": "明日へのワンポイントアドバイス",
      "feedback": "今日の総評と解説（カジュアルに）",
      "timestamp": "ISO形式のタイムスタンプ"
    }
  `;

  const logsSummary = logs.slice(-7).map(l => ({
    date: l.date,
    weight: l.weight,
    workoutsCount: l.workouts.length,
    totalWorkouts: l.workouts.map(w => `${w.exercise}: ${w.value}${w.unit}`)
  }));

  const prompt = `
    【ユーザープロフィール】
    - 目標体重: ${settings.targetWeight} kg
    - 身長: ${settings.height} cm
    - 年齢: ${settings.age} 歳
    - 性別: ${settings.gender === 'male' ? '男性' : '女性'}
    - 現在のBMI: ${bmi}
    - 現在の推定体脂肪率: ${bodyFat}%
    
    【直近7日間のログ】
    ${JSON.stringify(logsSummary, null, 2)}
    
    これを見て、明日の体重はどうなりそう？あと、プロフィールに合わせた最高のアドバイスをお願い！
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      predictedWeight: result.predictedWeight ?? 0,
      nextLoadAdjustment: result.nextLoadAdjustment ?? "明日も頑張ろう！",
      feedback: result.feedback ?? "バッチリだね！",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      predictedWeight: logs.length > 0 ? logs[logs.length-1].weight : 0,
      nextLoadAdjustment: "体調に気をつけてね！",
      feedback: "ちょっとエラーが出ちゃったけど、次は大丈夫！",
      timestamp: new Date().toISOString()
    };
  }
}
