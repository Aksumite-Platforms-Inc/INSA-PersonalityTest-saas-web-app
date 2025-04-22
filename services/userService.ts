import api from "./api";

export const getEmployeeTests = async (employeeId: string) => {
  try {
    const response = await api.get(`/organization/${employeeId}/tests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee tests:", error);
    throw error;
  }
};

export const submitTestAnswers = async (
  testId: string,
  answers: Record<number, string>
) => {
  try {
    const response = await api.post(
      `/organization/personalityTest/${testId}/submit`,
      { answers }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting test answers:", error);
    throw error;
  }
};
