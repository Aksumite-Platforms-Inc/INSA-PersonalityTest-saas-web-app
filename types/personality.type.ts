// ==============================
// ENUM-Like Types
// ==============================
export type PersonalityTestType = "oejts" | "enneagram" | "riasec" | "big_five";

// Optional: For dropdowns or labels
export const PersonalityTestTypeLabels: Record<PersonalityTestType, string> = {
  oejts: "MBTI (OEJTS)",
  enneagram: "Enneagram",
  riasec: "RIASEC",
  big_five: "Big Five",
};

// ==============================
// Score Entry (Enneagram/RIASEC)
// ==============================
export interface ScoreEntry {
  type: string;
  type_name?: string;
  score: number;
}

// ==============================
// MBTI Result
// ==============================
export interface MBTIResult {
  IE: number;
  SN: number;
  FT: number;
  JP: number;
  personality: string;
  description: string;
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
// Personality Test Score Object
// ==============================
export interface PersonalityTestScores {
  id: number;
  test_type?: PersonalityTestType;
  user_id: number;
  score_results?: ScoreEntry[];
  mbti?: MBTIResult;
  big_five?: BigFiveResult;
  version: number;
  status: string;
  completed_at?: string; // ISO string
  created_at?: string;
  updated_at?: string;
}

// ==============================
// API Response Wrapper
// ==============================
export interface ScoreResponse<T = any> {
  message: string;
  result: T;
}

// ==============================
// Request Payload Types
// ==============================

// ➤ OEJTS (MBTI)
export interface OEJTSRequest {
  a_answers: Record<number, number>; // Q# → 1–5
  b_answers: Record<number, number>;
}

// ➤ Enneagram
export interface EnneagramAnswer {
  type: string; // A–I
  answer: number; // 1–5
}
export interface EnneagramRequest {
  answers: EnneagramAnswer[];
}

// ➤ RIASEC
export interface RIASECRequest {
  answers: boolean[]; // length: 42
}

// ➤ Big Five
export interface BigFiveRequest {
  answers: Record<string, number>; // QID → 1–5
}
