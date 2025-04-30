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

export async function submitEnneagramAnswers(payload: {
  answers: { type: string; answer: number }[];
}) {
  const response = await api.post(
    "/personalityTest/ennegram/calculateScores",
    payload
  );
  return response.data;
}