import { getResults } from "@/services/testService";
import api from "@/services/api";
import MockAdapter from "axios-mock-adapter";

describe("testService", () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it("should fetch test results successfully", async () => {
    const mockResponse = { results: ["result1", "result2"] };
    mock
      .onGet("/organization/personalityTest/getResults?user_id=123")
      .reply(200, mockResponse);

    const result = await getResults("123");
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle fetch test results failure", async () => {
    mock
      .onGet("/organization/personalityTest/getResults?user_id=123")
      .reply(404, { message: "Results not found" });

    const result = await getResults("123");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Results not found");
  });
});
