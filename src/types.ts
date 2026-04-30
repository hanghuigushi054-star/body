/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkoutLog {
  exercise: string;
  value: number; // count or duration in seconds
  unit: 'reps' | 'seconds' | 'minutes';
}

export interface DailyLog {
  id: string;
  date: string; // ISO format
  weight: number;
  workouts: WorkoutLog[];
  note?: string;
}

export interface AIAnalysis {
  predictedWeight: number;
  nextLoadAdjustment: string;
  feedback: string;
  timestamp: string;
}

export interface UserSettings {
  targetWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  unit: 'kg' | 'lbs';
}
