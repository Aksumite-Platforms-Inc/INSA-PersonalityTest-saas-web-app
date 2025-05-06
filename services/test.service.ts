import apiClient from "./apiClient";
import { getAccessToken } from "@/utils/tokenUtils";
import { ApiResponse } from "@/types/api-response.type";
import {
  PersonalityTestScores,
  OEJTSRequest,
  EnneagramRequest,
  RIASECRequest,
  BigFiveRequest,
  EnneagramAnswer,
} from "@/types/personality.type";
import { handleApiError } from "@/utils/error.utils"; // Assuming you have a utility for error handling

// ============================
// Check if a test is taken
// ============================
export const checkTestTaken = async (
  memberId: number,
  testId: number,
): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<boolean>>(
    `/organization/checktest/members/${memberId}/tests/${testId}`,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to check test status.");
  }

  return response.data.data;
};

// ============================
// Get test results
// ============================
export const getResults = async (
  userId: string,
): Promise<ApiResponse<PersonalityTestScores>> => {
  try {
    const response = await apiClient.get<ApiResponse<PersonalityTestScores>>(
      `/organization/personalityTest/getResults?user_id=${userId}`,
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
  answers: RIASECRequest["answers"],
): Promise<ApiResponse<PersonalityTestScores>> => {
  try {
    const response = await apiClient.post<ApiResponse<PersonalityTestScores>>(
      "/personalityTest/riasec/calculateScores",
      { answers },
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ============================
// Submit Big Five Test Answers
// ============================
export const submitBig5TestAnswers = async (
  payload: BigFiveRequest,
): Promise<ApiResponse<PersonalityTestScores>> => {
  try {
    const response = await apiClient.post<ApiResponse<PersonalityTestScores>>(
      "/organization/personalityTest/bigfive/calculateScores",
      payload,
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ============================
// Submit OEJTS (MBTI) Answers
// ============================
export const submitMBTIAnswers = async (
  aAnswers: OEJTSRequest["a_answers"],
  bAnswers: OEJTSRequest["b_answers"],
): Promise<ApiResponse<PersonalityTestScores>> => {
  const payload: OEJTSRequest = {
    a_answers: aAnswers,
    b_answers: bAnswers,
  };

  try {
    const response = await apiClient.post<ApiResponse<PersonalityTestScores>>(
      "/organization/personalityTest/oejts/calculateScores",
      payload,
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ============================
// Submit Enneagram Answers
// ============================
export const submitEnneagramAnswers = async (
  payload: EnneagramRequest,
): Promise<ApiResponse<PersonalityTestScores>> => {
  try {
    const response = await apiClient.post<ApiResponse<PersonalityTestScores>>(
      "/personalityTest/ennegram/calculateScores",
      payload,
    );
    return response.data;
  } catch (error: any) {
    return handleApiError(error);
  }
};
