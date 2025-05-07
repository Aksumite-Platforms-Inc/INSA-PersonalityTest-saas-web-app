export type TestType = "oejts" | "enneagram" | "qualtrics" | "riasec"

export interface TestQuestion {
  id: number
  text: string
  options: TestOption[]
}

export interface TestOption {
  value: string
  label: string
  score?: number | Record<string, number>
}

export interface TestResult {
  id: string
  userId: string
  testType: TestType
  completedAt: string
  scores: Record<string, number>
  primaryType?: string
  secondaryType?: string
  interpretation?: string
  rawAnswers: Record<number, string>
}

// OEJTS specific types
export interface OEJTSResult extends TestResult {
  dimensions: {
    ei: number // Extraversion vs. Introversion
    sn: number // Sensing vs. Intuition
    tf: number // Thinking vs. Feeling
    jp: number // Judging vs. Perceiving
  }
  personalityType: string // e.g., "INTJ"
  typeDescription: string
}

// Enneagram specific types
export interface EnneagramResult extends TestResult {
  primaryType: string // 1-9
  secondaryType: string // 1-9
  typeDescriptions: {
    primary: string
    secondary: string
  }
  wings: {
    left: number
    right: number
  }
}

// Qualtrics specific types
export interface QualtricsResult extends TestResult {
  factors: Record<string, number>
  insights: string[]
  recommendations: string[]
}

// RIASEC specific types
export interface RIASECResult extends TestResult {
  scores: {
    realistic: number
    investigative: number
    artistic: number
    social: number
    enterprising: number
    conventional: number
  }
  topTypes: string[] // Top 3 types
  careerSuggestions: string[]
}
