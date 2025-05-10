import apiClient from "./apiClient";
import { getAccessToken } from "@/utils/tokenUtils";
import { handleApiError } from "@/utils/error.utils";
import fs from "fs";
import path from "path";

import {
  ApiResponse,
  OEJTSRequest,
  EnneagramRequest,
  RIASECRequest,
  BigFiveRequest,
  MBTIResult,
  BigFiveResult,
  ScoreEntry,
  PersonalityTestScores,
} from "@/types/personality.type";

// Simple helper to save payload to local folder
const savePayloadToFile = (fileName: string, payload: any) => {
  try {
    const dirPath = path.join(process.cwd(), "saved-payloads");
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`✅ Saved payload to ${filePath}`);
  } catch (error) {
    console.error("❌ Error saving payload to file system:", error);
  }
};

// ============================
// Check if a test is taken
// ============================
export const checkTestTaken = async (
  memberId: number,
  testId: number
): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<boolean>>(
    "/organization/checktest/members/${memberId}/tests/${testId}"
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to check test status.");
  }

  return response.data.data;
};

// ============================
// Get all test results (aggregated)
// ============================
export const getResults = async (
  userId: string
): Promise<ApiResponse<PersonalityTestScores>> => {
  try {
    const response = await apiClient.get<ApiResponse<PersonalityTestScores>>(
      "/organization/personalityTest/getResults?user_id=${userId}"
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ============================
// Submit RIASEC Test Answers
// ============================
export const submitRIASECAnswers = async (
  answers: RIASECRequest["answers"]
): Promise<ApiResponse<ScoreEntry[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<ScoreEntry[]>>(
      "/organization/personalityTest/riasec/calculateScores",
      { answers }
    );
    return response.data;
  } catch (error: any) {
    savePayloadToFile("riasec-answers.json", { answers });
    return handleApiError(error);
  }
};

// ============================
// Submit Big Five Test Answers
// ============================
export const submitBig5TestAnswers = async (
  payload: BigFiveRequest
): Promise<ApiResponse<BigFiveResult>> => {
  try {
    const response = await apiClient.post<ApiResponse<BigFiveResult>>(
      "/organization/personalityTest/bigfive/calculateScores",
      payload
    );
    return response.data;
  } catch (error: any) {
    savePayloadToFile("bigfive-answers.json", payload);
    return handleApiError(error);
  }
};

// ============================
// Submit OEJTS (MBTI) Answers
// ============================
export const submitMBTIAnswers = async (
  aAnswers: OEJTSRequest["a_answers"],
  bAnswers: OEJTSRequest["b_answers"]
): Promise<ApiResponse<MBTIResult>> => {
  const payload: OEJTSRequest = {
    a_answers: aAnswers,
    b_answers: bAnswers,
  };

  try {
    const response = await apiClient.post<ApiResponse<MBTIResult>>(
      "/organization/personalityTest/oejts/calculateScores",
      payload
    );
    return response.data;
  } catch (error: any) {
    savePayloadToFile("mbti-answers.json", payload);
    return handleApiError(error);
  }
};

// ============================
// Submit Enneagram Answers
// ============================
export const submitEnneagramAnswers = async (
  payload: EnneagramRequest
): Promise<ApiResponse<ScoreEntry[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<ScoreEntry[]>>(
      "/organization/personalityTest/ennegram/calculateScores",
      payload
    );
    return response.data;
  } catch (error: any) {
    savePayloadToFile("enneagram-answers.json", payload);
    return handleApiError(error);
  }
};
