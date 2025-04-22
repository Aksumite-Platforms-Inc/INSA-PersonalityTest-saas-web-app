import api from "./api";

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/sso/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Perform logout logic if needed
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
