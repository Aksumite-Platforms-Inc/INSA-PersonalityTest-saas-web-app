// ==============================
// ENUM-Like Types
// ==============================
export type PersonalityTestType = "oejts" | "enneagram" | "riasec" | "big_five";

export const PersonalityTestTypeLabels: Record<PersonalityTestType, string> = {
  oejts: "MBTI (OEJTS)",
  enneagram: "Enneagram",
  riasec: "RIASEC",
  big_five: "Big Five",
};

// ==============================
// Common Score Entry (Enneagram, RIASEC)
// ==============================
export interface ScoreEntry {
  type: string;         // e.g., 'A', 'B', 'R', 'I'
  type_name?: string;   // e.g., 'The Achiever', 'Realistic'
  score: number;        // e.g., 7 or 5
}

// ==============================
// MBTI Result
// ==============================
export interface MBTIResult {
  IE: number;              // Introversion-Extroversion
  SN: number;              // Sensing-Intuition
  FT: number;              // Feeling-Thinking
  JP: number;              // Judging-Perceiving
  personality: string;     // e.g., "INTJ"
  description: string[];   // description paragraphs
}

// ==============================
// Big Five Result
// ==============================
export interface BigFiveResult {
  raw: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  normalized: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

// ==============================
// Combined Test Score Object
// ==============================
export interface PersonalityTestScores {
  id: number;
  test_type: PersonalityTestType;
  user_id: number;
  enneagram_scores?: ScoreEntry[];
  riasec_scores?: ScoreEntry[];
  mbti?: MBTIResult;
  big_five?: BigFiveResult;
  version: number;
  status: string;
  completed_at?: string;  // ISO string
  created_at?: string;
  updated_at?: string;
}

// ==============================
// Unified API Response Wrapper
// ==============================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

// ==============================
// Request Payload Types
// ==============================

// ➤ OEJTS (MBTI)
export interface OEJTSRequest {
  a_answers: Record<number, number>; // e.g., { 1: 4, 2: 2 }
  b_answers: Record<number, number>; // e.g., { 1: 3, 2: 5 }
}

// ➤ Enneagram
export interface EnneagramAnswer {
  type: string;  // e.g., "A" to "I"
  answer: number; // 1–5
}
export interface EnneagramRequest {
  answers: EnneagramAnswer[];
}

// ➤ RIASEC
export interface RIASECRequest {
  answers: boolean[]; // 42 true/false values
}

// ➤ Big Five
export interface BigFiveRequest {
  answers: Record<string, number>; // e.g., { "1": 4, "2": 3 }
}
