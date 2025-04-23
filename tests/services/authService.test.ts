import { login, resetPassword } from "@/services/authService";
import api from "@/services/api";
import MockAdapter from "axios-mock-adapter";

describe("authService", () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it("should login successfully", async () => {
    const mockResponse = { token: "mockToken" };
    mock.onPost("/sso/login").reply(200, mockResponse);

    const result = await login("test@example.com", "password123");
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle login failure", async () => {
    mock.onPost("/sso/login").reply(401, { message: "Invalid credentials" });

    const result = await login("test@example.com", "wrongpassword");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid credentials");
  });

  it("should reset password successfully", async () => {
    mock.onPost("/organization/members/resetpassword").reply(200);

    const result = await resetPassword("test@example.com");
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should handle reset password failure", async () => {
    mock
      .onPost("/organization/members/resetpassword")
      .reply(400, { message: "User not found" });

    const result = await resetPassword("test@example.com");
    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
  });
});
