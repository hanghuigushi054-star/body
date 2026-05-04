import {GoogleGenAI} from "@google/genai";
import {DailyLog, AIAnalysis, UserSettings} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TrainingMenu {
  title: string;
  description: string;
  exercises: { name: string; reps: string; note: string }[];
  motivation: string;
}

export async function proposeTrainingMenu(
  settings: UserSettings,
  currentWeight?: number
): Promise<TrainingMenu> {
  const model = "gemini-3.1-pro-preview"; // Use the pro preview for better quality if possible or current model

  let bmi = "不明";
  if (currentWeight && settings.height) {
    bmi = (currentWeight / Math.pow(settings.height / 100, 2)).toFixed(1);
  }

  const environmentText = settings.environment === 'home' ? '自宅' : settings.environment === 'gym' ? 'ジム' : '指定なし';
  const goalText = settings.goal === 'lose_weight' ? '減量' : settings.goal === 'build_muscle' ? '筋肉をつけたい' : '維持したい';

  const systemInstruction = `
    あなたは「世界一親身で優秀なAIパーソナルトレーナー」です。
    ユーザーの属性と目的に合わせて、最適なトレーニングメニューを1つ提案してください。
    
    出力形式 (JSON):
    {
      "title": "メニューのタイトル（例：自宅でできる！燃焼系サーキット）",
      "description": "なぜこのメニューがおすすめなのかの解説",
      "exercises": [
        { "name": "種目名", "reps": "回数や秒数", "note": "気をつけるポイント" }
      ],
      "motivation": "ユーザーがやる気になる熱い一言！"
    }
  `;

  const prompt = `
    【ユーザープロフィール】
    - 目標体重: ${settings.targetWeight} kg
    - 現在の体重: ${currentWeight ? currentWeight + ' kg' : '未入力'}
    - 身長: ${settings.height} cm
    - 年齢: ${settings.age} 歳
    - 性別: ${settings.gender === 'male' ? '男性' : '女性'}
    - BMI: ${bmi}
    
    【目的と環境】
    - 目的: ${goalText}
    - 環境: ${environmentText}
    
    このユーザーにぴったりのトレーニングメニューを提案して！
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
      title: result.title ?? "おすすめトレーニング",
      description: result.description ?? "あなたに合わせたメニューです。",
      exercises: result.exercises ?? [],
      motivation: result.motivation ?? "今日も頑張りましょう！"
    };
  } catch (error) {
    console.error("AI Training Menu Error:", error);
    return {
      title: "通信エラー",
      description: "現在メニューを取得できません。",
      exercises: [],
      motivation: "少し待ってからお試しください！"
    };
  }
}

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
