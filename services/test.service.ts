import apiClient from "./apiClient";
import { getAccessToken, getUserId } from "@/utils/tokenUtils";
import { handleApiError } from "@/utils/error.utils";
import { savePayloadToGist } from "./gistApi";
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

// Update the `savePayloadToFile` function to include user ID and test name in the payload
const savePayloadToFile = async (
  fileName: string,
  payload: any,
  userId: string,
  testName: string
) => {
  try {
    const content = JSON.stringify({ userId, testName, ...payload }, null, 2);
    const gistUrl = await savePayloadToGist(fileName, content);
    console.log(`✅ Payload saved to Gist: ${gistUrl}`);
    console.log("Gist URL:", gistUrl); // Additional log for verification
  } catch (error) {
    console.error("❌ Error saving payload to Gist:", error);
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
    `/organization/checktest/members/${memberId}/tests/${testId}`
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
      `/organization/personalityTest/getResults?user_id=${userId}`
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Update the `submitRIASECAnswers` function to use `getUserId` from `tokenUtils`
export const submitRIASECAnswers = async (
  answers: RIASECRequest["answers"]
): Promise<ApiResponse<ScoreEntry[]>> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID is missing from the token.");

  try {
    const response = await apiClient.post<ApiResponse<ScoreEntry[]>>(
      "/organization/personalityTest/riasec/calculateScores",
      { answers }
    );
    return response.data;
  } catch (error: any) {
    await savePayloadToFile(
      "riasec-answers.json",
      { answers },
      userId.toString(),
      "RIASEC"
    );
    return handleApiError(error);
  }
};

// Update the `submitBig5TestAnswers` function to use `getUserId` from `tokenUtils`
export const submitBig5TestAnswers = async (
  payload: BigFiveRequest
): Promise<ApiResponse<BigFiveResult>> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID is missing from the token.");

  try {
    const response = await apiClient.post<ApiResponse<BigFiveResult>>(
      "/organization/personalityTest/bigfive/calculateScores",
      payload
    );
    return response.data;
  } catch (error: any) {
    await savePayloadToFile(
      "bigfive-answers.json",
      payload,
      userId.toString(),
      "Big Five"
    );
    return handleApiError(error);
  }
};

// Update the `submitMBTIAnswers` function to use `getUserId` from `tokenUtils`
export const submitMBTIAnswers = async (
  aAnswers: OEJTSRequest["a_answers"],
  bAnswers: OEJTSRequest["b_answers"]
): Promise<ApiResponse<MBTIResult>> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID is missing from the token.");

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
    await savePayloadToFile(
      "mbti-answers.json",
      payload,
      userId.toString(),
      "MBTI"
    );
    return handleApiError(error);
  }
};

// Update the `submitEnneagramAnswers` function to use `getUserId` from `tokenUtils`
export const submitEnneagramAnswers = async (
  payload: EnneagramRequest
): Promise<ApiResponse<ScoreEntry[]>> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID is missing from the token.");

  try {
    const response = await apiClient.post<ApiResponse<ScoreEntry[]>>(
      "/organization/personalityTest/ennegram/calculateScores",
      payload
    );
    return response.data;
  } catch (error: any) {
    await savePayloadToFile(
      "enneagram-answers.json",
      payload,
      userId.toString(),
      "Enneagram"
    );
    return handleApiError(error);
  }
};
