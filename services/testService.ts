// services/testService.ts
import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

export const getResults = async (userId: string): Promise<APIResponse<any>> => {
  try {
    const response = await api.get(
      `/organization/personalityTest/getResults?user_id=${userId}`
    );
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
export const submitRIASECAnswers = async (
  answers: boolean[]
): Promise<APIResponse<any>> => {
  const payload = { answers };

  try {
    const response = await api.post(
      "/personalityTest/riasec/calculateScores",
      payload
    );
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const submitBig5TestAnswers = async (payload: string) => {
  try {
    //Make the API request
    const response = await api.post(
      "/organization/personalityTest/bigfive/calculateScores",
      payload
    );
    // console.log(payload);
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Function to submit MBTI answers
export const submitMBTIAnswers = async (
  aAnswers: Record<number, number>,
  bAnswers: Record<number, number>
): Promise<APIResponse<any>> => {
  try {
    const response = await api.post(
      "/organization/personalityTest/oejts/calculateScores",
      {
        a_answers: aAnswers,
        b_answers: bAnswers,
      }
    );
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
