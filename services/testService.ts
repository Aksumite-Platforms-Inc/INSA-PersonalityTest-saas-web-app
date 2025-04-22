import api from "./api";

export const calculateScores = async (testType: string, answers: any) => {
  try {
    const response = await api.post(
      `/organization/personalityTest/${testType}/calculateScores`,
      answers
    );
    return response.data;
  } catch (error) {
    console.error("Error calculating scores:", error);
    throw error;
  }
};

export const getTestResults = async (userId: string) => {
  try {
    const response = await api.get(`/organization/personalityTest/getResults`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching test results:", error);
    throw error;
  }
};
